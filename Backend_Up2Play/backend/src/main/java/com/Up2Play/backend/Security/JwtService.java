package com.Up2Play.backend.Security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.security.Key;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;
    public String generarToken(String email, String rol) {
        Key key = Keys.hmacShaKeyFor(secret.getBytes());
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Date exp = new Date(nowMillis + expiration);

        return Jwts.builder()
                .subject(email)
                .claim("rol", rol)
                .issuedAt(now)
                .expiration(exp)
                .signWith(key)
                .compact();
    }    
}



