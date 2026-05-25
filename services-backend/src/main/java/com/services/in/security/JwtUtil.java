package com.services.in.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;

/**
 * Handles JWT creation and validation.
 *
 * Token claims include:
 *   - sub   : provider email (used to reload from DB on each request)
 *   - role  : "PROVIDER" (matches auth token role claim contract in API plan)
 *   - id    : provider database id
 */
@Component
public class JwtUtil {

    private final Key signingKey;
    private final long expirationMs;

    public JwtUtil(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    /**
     * Generate a signed JWT for a fully active provider.
     *
     * @param email      provider email – used as the JWT subject
     * @param providerId provider database ID – embedded as an extra claim
     * @param role       role string, always "PROVIDER" from this module
     * @return signed compact JWT string
     */
    public String generateToken(String email, Long providerId, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(email)
                .addClaims(Map.of(
                        "id", providerId,
                        "role", role
                ))
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extract the email (subject) from a token without validation.
     * Always call {@link #validateToken(String)} first.
     */
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public Long extractProviderId(String token) {
        Object id = parseClaims(token).get("id");
        if (id instanceof Integer i) return i.longValue();
        if (id instanceof Long l) return l;
        return null;
    }

    public String extractRole(String token) {
        return (String) parseClaims(token).get("role");
    }

    /**
     * Validate signature and expiry.
     *
     * @return true if the token is well-formed, signed with our key, and not expired
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    // ── Internal ─────────────────────────────────────────────

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
