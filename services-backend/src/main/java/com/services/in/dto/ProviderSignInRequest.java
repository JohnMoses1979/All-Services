package com.services.in.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.NoArgsConstructor;

/**
 * Request body for POST /api/provider/auth/signin.
 * Matches user/SignIn.js — provider logs in with mobile + password.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderSignInRequest {

    @NotBlank(message = "Mobile number is required")
    private String mobile;

    @NotBlank(message = "Password is required")
    private String password;
}
