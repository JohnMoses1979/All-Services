package com.services.in.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import lombok.NoArgsConstructor;

/**
 * Returned after a successful sign-in or skill-selection (registration complete).
 * Matches the AuthResponse { token, user } shape in the BACKEND-API-PLAN.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    /**
     * JWT bearer token — the frontend stores this for all subsequent requests
     */
    private String token;

    /**
     * Role claim embedded in the JWT. Always "PROVIDER" for the labour module.
     * Matches the role claim values agreed in the API plan: customer | provider
     * | admin
     */
    private String role;

    /**
     * Full provider profile included so the frontend doesn't need a second API
     * call
     */
    private ProviderDto provider;
}
