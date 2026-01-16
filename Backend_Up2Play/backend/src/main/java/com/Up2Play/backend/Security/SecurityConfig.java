package com.Up2Play.backend.Security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

//import jakarta.servlet.http.HttpServletResponse;

/**
 * Configuración de seguridad para la aplicación.
 * Habilita Web Security, CORS, JWT stateless y autorización de endpoints.
 * Deshabilita CSRF y sesiones tradicionales para API REST con JWT.
 */
@Configuration
@EnableWebSecurity // Activa la seguridad web de Spring Security
@EnableMethodSecurity // Habilita anotaciones como @PreAuthorize para control de métodos
public class SecurityConfig {

    // Dependencias inyectadas para autenticación y filtros
    private final AuthenticationProvider authenticationProvider; // Proveedor de autenticación
    private final JwtAuthenticationFilter jwtAuthenticationFilter; // Filtro personalizado para validar JWT

    // Constructor que inyecta las dependencias de seguridad.
    public SecurityConfig(AuthenticationProvider authenticationProvider,
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Bean principal que configura la cadena de filtros de seguridad HTTP.
     * Define CORS, CSRF, sesiones, autorización y manejo de excepciones.
     **/
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                // Permite peticiones desde otros orígenes (como Angular en localhost:4201)
                .cors(cors -> {
                })
                // Desactiva CSRF (protección contra ataques de formularios, no necesaria con
                // JWT)
                .csrf(csrf -> csrf.disable())
                // No se usan sesiones (stateless), porque JWT se manda en cada petición
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Define qué rutas son públicas y cuáles requieren login
                .authorizeHttpRequests(auth -> auth
                        // Permite peticiones OPTIONS (necesarias para CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Permite acceso libre a rutas de login y registro
                        .requestMatchers("/auth/**").permitAll()
                        // Permite acceso libre a Swagger (documentación de la API)
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        // Permite acceso a ver info de usuarios, necesario para saber a quien pagar en Stripe
                        .requestMatchers(HttpMethod.GET, "/usuarios/{id}").authenticated() 
                        // Permite acceso a webhooks, necesario para Stripe
                        .requestMatchers("/api/webhooks/**").permitAll()
                        // Todas las demás rutas requieren que el usuario esté autenticado
                        .anyRequest().authenticated())
                // Usa el proveedor de autenticación personalizado para validar usuarios
                .authenticationProvider(authenticationProvider)
                // Agrega el filtro JWT antes del filtro de autenticación por defecto
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                // Desactiva login por formulario y autenticación básica (solo JWT)
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable())
                .build();
    }

    // Configura CORS para permitir que el frontend se comunique con el backend
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        // Orígenes permitidos (ajusta según tu frontend en desarrollo/producción)
        cfg.setAllowedOrigins(
                List.of("http://localhost:4201", "http://localhost:8081", "https://dashboard.stripe.com"));
        // Métodos HTTP permitidos (incluye OPTIONS para preflight)
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        // Headers permitidos (incluye Authorization para JWT)
        cfg.setAllowedHeaders(
                List.of("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "Stripe-Signature"));
        // Headers expuestos al cliente (ej: para descargar archivos)
        cfg.setExposedHeaders(List.of("Authorization", "Content-Disposition"));
        // No permite credenciales (cookies) ya que usamos JWT en headers
        cfg.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg); // Aplica a todos los endpoints
        return source;
    }
}
