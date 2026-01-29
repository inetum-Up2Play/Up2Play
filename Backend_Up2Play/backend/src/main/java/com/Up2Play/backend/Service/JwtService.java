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

//Servicio para generar, validar y extraer información de tokens JWT.
@Service
public class JwtService {

    // Clave secreta para firmar y verificar los tokens (se guarda en
    // application.properties
    @Value("${spring.security.jwt.secret-key}")
    private String secretKeyBase64;

    // Tiempo de expiración del token en milisegundos (configurable)
    @Value("${spring.security.jwt.expiration-time}")
    private long jwtExpiration;

    // Extrae el email (username) del token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extrae una parte específica del token (una "claim")
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        final Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    // Genera un token JWT básico para el usuario (sin claims extras).
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    // Genera un token con información extra (por ejemplo, roles)
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    // Retorna el tiempo de expiración configurado.
    public long getExpirationTime() {
        return jwtExpiration;
    }

    // Construye el token JWT con toda la información necesaria (claims, subject,
    // fechas y firma).
    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(now)
                .expiration(exp)
                .signWith(getSecretKey(), Jwts.SIG.HS256)
                .compact();
    }

    // Valida si el token es válido para el usuario especificado.
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // Verifica si el token ha expirado comparando con la fecha actual.
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extrae la fecha de expiración del token.
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extrae toda la información del token (claims)
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Genera la clave secreta HMAC a partir de la cadena base64.
    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKeyBase64);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
