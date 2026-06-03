package com.slotora.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secretKey;

    @Value("${app.jwt.expiration}")
    private long expirationMs;

    // Generate a JWT token for a given email
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    // Extract email from token
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    // Check if token is valid and not expired
    public boolean isTokenValid(String token, String email) {
        return extractEmail(token).equals(email)
                && !isTokenExpired(token);
    }

    // Check if token is expired
    private boolean isTokenExpired(String token) {
        return extractClaims(token)
                .getExpiration()
                .before(new Date());
    }

    // Extract all claims from token
    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Build the signing key from secret
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }
}