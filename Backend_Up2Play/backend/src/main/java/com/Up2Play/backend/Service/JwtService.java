package com.Up2Play.backend.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Servicio para generar, validar y extraer información de tokens JWT.
 * Utiliza JJWT para el manejo de tokens con firma HS256 y claves secretas.
 * Configuración via application.properties (secret-key y expiration-time).
 */
@Service
public class JwtService {

    // Clave secreta en base64 para firmar/verificar tokens (debe ser segura y
    // larga)
    @Value("${spring.security.jwt.secret-key}")
    private String secretKeyBase64;

    // Tiempo de expiración del token en milisegundos (configurable)
    @Value("${spring.security.jwt.expiration-time}")
    private long jwtExpiration; // ms

    /**
     * Extrae el nombre de usuario (subject) del token JWT.
     * 
     * @param token El token JWT a procesar.
     * @return El username extraído.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrae una claim específica del token usando un resolver funcional.
     * 
     * @param token    El token JWT.
     * @param resolver Función para resolver la claim de los Claims.
     * @param <T>      Tipo de la claim.
     * @return El valor de la claim.
     */
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        final Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    /**
     * Genera un token JWT básico para el usuario (sin claims extras).
     * 
     * @param userDetails Detalles del usuario (incluye username).
     * @return El token JWT generado.
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Genera un token JWT con claims adicionales opcionales.
     * 
     * @param extraClaims Claims extras a incluir (ej: roles).
     * @param userDetails Detalles del usuario.
     * @return El token JWT generado.
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    /**
     * Retorna el tiempo de expiración configurado.
     * 
     * @return Tiempo en milisegundos.
     */
    public long getExpirationTime() {
        return jwtExpiration;
    }

    /**
     * Construye el token JWT con claims, subject, fechas y firma.
     * Método privado usado por generateToken.
     */
    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(extraClaims) // Claims adicionales
                .subject(userDetails.getUsername()) // Username como subject
                .issuedAt(now) // Fecha de emisión
                .expiration(exp) // Fecha de expiración
                .signWith(getSecretKey(), Jwts.SIG.HS256) // Firma HS256
                .compact(); // Compacta a string
    }

    /**
     * Valida si el token es válido para el usuario especificado.
     * Verifica username y no expirado; maneja excepciones como inválido.
     * 
     * @param token       El token JWT.
     * @param userDetails Detalles del usuario.
     * @return true si es válido, false si no.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (Exception e) {
            return false; // Cualquier error (ej: firma inválida) lo invalida
        }
    }

    /**
     * Verifica si el token ha expirado comparando con la fecha actual.
     * 
     * @param token El token JWT.
     * @return true si expirado.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extrae la fecha de expiración del token.
     * 
     * @param token El token JWT.
     * @return La fecha de expiración.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Parsea el token y extrae todas las claims (payload verificado).
     * 
     * @param token El token JWT.
     * @return Las claims del token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey()) // Verifica firma con clave secreta
                .build()
                .parseSignedClaims(token) // Parsea y verifica
                .getPayload(); // Retorna payload (claims)
    }

    /**
     * Genera la clave secreta HMAC a partir de la cadena base64.
     * 
     * @return SecretKey para HS256.
     */
    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKeyBase64);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
