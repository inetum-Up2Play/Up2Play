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

import jakarta.servlet.http.HttpServletResponse;

/**
 * Configuración de seguridad para la aplicación Spring Boot.
 * Habilita Web Security, CORS, JWT stateless y autorización de endpoints.
 * Deshabilita CSRF y sesiones tradicionales para API REST con JWT.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Habilita anotaciones como @PreAuthorize para control de métodos
public class SecurityConfig {

    // Dependencias inyectadas para autenticación y filtros
    private final AuthenticationProvider authenticationProvider;  // Proveedor de autenticación (ej: DaoAuthenticationProvider)
    private final JwtAuthenticationFilter jwtAuthenticationFilter;  // Filtro personalizado para validar JWT

    /**
     * Constructor que inyecta las dependencias de seguridad.
     */
    public SecurityConfig(AuthenticationProvider authenticationProvider,
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Bean principal que configura la cadena de filtros de seguridad HTTP.
     * Define CORS, CSRF, sesiones, autorización y manejo de excepciones.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                // 1) Habilita CORS usando la configuración personalizada
                .cors(cors -> {})
                // 2) Deshabilita CSRF (no necesario para API stateless con JWT)
                .csrf(csrf -> csrf.disable())
                // 3) Configura sesiones como stateless (sin cookies de sesión)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 4) Reglas de autorización por endpoint
                .authorizeHttpRequests(auth -> auth
                        // Permite solicitudes OPTIONS (preflight CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Endpoints públicos: autenticación y registro
                        .requestMatchers("/auth/**").permitAll()
                        // (Opcional) Acceso público a Swagger UI y docs
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        // Todas las demás solicitudes requieren autenticación
                        .anyRequest().authenticated())
                // 5) Usa el proveedor de autenticación personalizado
                .authenticationProvider(authenticationProvider)
                // 6) Agrega el filtro JWT antes del filtro de autenticación por defecto
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                // 7) Manejo de excepciones: 401 para no autenticado, 403 para acceso denegado
                //.exceptionHandling(ex -> ex
                   //     .authenticationEntryPoint((req, res, e) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                    //    .accessDeniedHandler((req, res, e) -> res.sendError(HttpServletResponse.SC_FORBIDDEN)))
                // 8) Deshabilita autenticación básica y login por formulario (solo JWT)
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable())
                .build();
    }

    /**
     * Bean para configuración CORS: permite solicitudes desde orígenes específicos (ej: frontend Angular).
     * Define métodos, headers y credenciales permitidos para evitar errores de cross-origin.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        // Orígenes permitidos (ajusta según tu frontend en desarrollo/producción)
        cfg.setAllowedOrigins(List.of("http://localhost:4200", "http://localhost:8080"));
        // Métodos HTTP permitidos (incluye OPTIONS para preflight)
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        // Headers permitidos (incluye Authorization para JWT)
        cfg.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        // Headers expuestos al cliente (ej: para descargar archivos)
        cfg.setExposedHeaders(List.of("Authorization", "Content-Disposition"));
        // No permite credenciales (cookies) ya que usamos JWT en headers
        cfg.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);  // Aplica a todos los endpoints
        return source;
    }
}
