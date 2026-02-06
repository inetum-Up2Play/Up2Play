package com.Up2Play.backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioNoEncontradoException;
import com.Up2Play.backend.Repository.UsuarioRepository;

/*
 *Configuración de Seguridad. 
 *Hace que un usuario pueda atentificarse de forma segura.
*/
@Configuration
public class ApplicationConfiguration {

    // Inyección del repositorio
    private final UsuarioRepository usuarioRepository;

    // Constructor que recibe el acceso a la base de datos
    public ApplicationConfiguration(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Función que busca un usuario por su email. Es usado cuando alguien intenta
    // iniciar sesión.
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
    }

    // Función para codificar contraseñas.
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Función para coordinar el proceso de login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Función para validar credenciales.
     * Usa el buscador de usuarios (userDetailsService) y el codificador de
     * contraseñas (passwordEncoder) para verificar si el usuario existe y si la
     * contraseña es correcta.
     **/
    @SuppressWarnings("deprecation")
    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService,
            BCryptPasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

}
