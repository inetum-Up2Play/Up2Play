package com.Up2Play.backend.Security;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.Up2Play.backend.Service.JwtService;

import org.springframework.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

// Filtro de seguridad que se ejecuta cada vez que llega una petición HTTP
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer "; //  Prefijo que debe tener el token en el header

    // Dependencias inyectadas
    private final HandlerExceptionResolver handlerExceptionResolver; // Maneja excepciones globales
    private final JwtService jwtService; // Servicio para validar y extraer datos del JWT
    private final UserDetailsService userDetailsService; // Carga detalles del usuario por username

    // Constructor que inyecta las dependencias necesarias
    public JwtAuthenticationFilter(
            @Qualifier("handlerExceptionResolver") HandlerExceptionResolver handlerExceptionResolver,
            JwtService jwtService,
            UserDetailsService userDetailsService) {
        this.handlerExceptionResolver = handlerExceptionResolver;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Este método se ejecuta en cada petición HTTP
     * Valida JWT, autentica usuario y continúa la cadena de filtros.
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        //Leer el header "Authorization"
        final String authHeader = request.getHeader("Authorization");

        // Verifica si el header existe y comienza con "Bearer " (insensible a mayúsculas)
        if (authHeader == null || !authHeader.regionMatches(true, 0, BEARER_PREFIX, 0, BEARER_PREFIX.length())) {
            // Si no hay token, continuar sin autenticación
            filterChain.doFilter(request, response); 
            return;
        }

        try {
            // Extrae el token JWT del header (quita el prefijo y espacios)
            final String jwt = authHeader.substring(BEARER_PREFIX.length()).trim();
            if (jwt.isEmpty()) {
                filterChain.doFilter(request, response); // Si el Token está vacío, continúa
                return;
            }

            // Extrae el email del usuario del JWT
            final String userEmail = jwtService.extractUsername(jwt);
            final Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();

            // Si hay email y no hay autenticación actual, procede
            if (userEmail != null && currentAuth == null) {
                // Carga detalles del usuario
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                // Valida el token con los detalles del usuario
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // Crea y establece el token de autenticación en el contexto de seguridad
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            filterChain.doFilter(request, response); // Continúa la cadena de filtros
        } catch (Exception ex) {
            // Maneja errores (ej: token inválido) delegando al resolver global
            handlerExceptionResolver.resolveException(request, response, null, ex);
        }
    }
}