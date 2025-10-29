package com.Up2Play.backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.Up2Play.backend.Repository.UsuarioRepository;

/**
 * Configuración de Spring Security para autenticación de usuarios.
 * Define beans para UserDetailsService, codificador de contraseñas y
 * proveedores de autenticación.
 */
@Configuration
public class ApplicationConfiguration {
    /**
     * Repositorio de usuarios inyectado para cargar datos durante autenticación.
     */
    private final UsuarioRepository usuarioRepository;

    /**
     * Constructor que inyecta el repositorio de usuarios.
     * 
     * @param usuarioRepository Repositorio a inyectar.
     */
    public ApplicationConfiguration(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Bean para UserDetailsService: carga usuario por email o lanza excepción si no
     * existe.
     * 
     * @return Implementación que busca en el repositorio.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }

    /**
     * Bean para codificador BCrypt de contraseñas (hash seguro).
     * 
     * @return Instancia de BCryptPasswordEncoder.
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Bean para AuthenticationManager: procesa autenticaciones.
     * 
     * @param config Configuración de Spring.
     * @return Manager obtenido de la config.
     * @throws Exception En caso de error.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Bean para AuthenticationProvider: usa UserDetailsService y PasswordEncoder
     * para validar credenciales. Refactorizado para inyectar dependencias directamente,
     * evitando warnings de deprecación.
     * 
     * @param userDetailsService Servicio de detalles de usuario.
     * @param passwordEncoder Codificador de contraseñas.
     * @return DaoAuthenticationProvider configurado.
     */
    @SuppressWarnings("deprecation")
    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, BCryptPasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }
}
