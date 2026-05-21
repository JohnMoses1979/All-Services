package com.services.in.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.services.in.dto.ApiResponse;
import com.services.in.dto.AuthResponse;
import com.services.in.dto.ProviderSignInRequest;
import com.services.in.dto.ProviderSignUpRequest;
import com.services.in.dto.SelectSkillsRequest;
import com.services.in.dto.SendOtpRequest;
import com.services.in.dto.VerifyOtpRequest;
import com.services.in.service.ProviderAuthService;
import com.services.in.dto.ForgotPasswordRequest;

import jakarta.validation.Valid;

/**
 * REST controller for all provider authentication endpoints.
 *
 * Base URL: /api/provider/auth
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ PROVIDER SIGNUP FLOW │ │ │ │ 1. POST /signup → registers account, triggers
 * OTP email │ │ 2. POST /verify-otp → verifies 6-digit OTP from email │ │ 3.
 * POST /select-skills → saves skill categories, activates account │ │ returns
 * JWT immediately so provider is logged in │ │ │ │ PROVIDER SIGN IN FLOW │ │ │
 * │ POST /signin → mobile + password → JWT │ │ │ │ OTP HELPERS │ │ │ │ POST
 * /send-otp → resend / send OTP (signup or forgot-pw) │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * All responses use the ApiResponse<T> envelope for consistency.
 */
@RestController
@RequestMapping("/api/provider/auth")
public class ProviderAuthController {

    private final ProviderAuthService authService;

    public ProviderAuthController(ProviderAuthService authService) {
        this.authService = authService;
    }

    // ── 1. Signup ─────────────────────────────────────────────
    /**
     * POST /api/provider/auth/signup
     *
     * Creates a new provider account and sends an OTP to the provided email.
     *
     * Request body: ProviderSignUpRequest { fullName, mobile, email, password,
     * area, experienceYears? }
     *
     * Response: 201 Created { success: true, message: "...", data: null }
     */
    @PostMapping(value = "/signup", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> signUp(
            @Valid @ModelAttribute ProviderSignUpRequest request) {

        authService.signUp(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok(
                        "Registration started. A 6-digit OTP has been sent to "
                        + request.getEmail() + ". Please verify to continue."));
    }

    // ── 2. Send / Resend OTP ──────────────────────────────────
    /**
     * POST /api/provider/auth/send-otp
     *
     * Sends (or resends) an OTP to the given email. A new OTP automatically
     * invalidates the previous one.
     *
     * Request body: SendOtpRequest { email, purpose? } purpose defaults to
     * "SIGNUP"
     *
     * Response: 200 OK { success: true, message: "OTP sent successfully." }
     */
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        authService.sendOtp(request.getMobile(), request.getPurpose());

        return ResponseEntity.ok(ApiResponse.ok("OTP sent successfully to " + request.getMobile()));
    }

    // ── 3. Verify OTP ─────────────────────────────────────────
    /**
     * POST /api/provider/auth/verify-otp
     *
     * Verifies the 6-digit OTP the provider entered. On success, account status
     * advances from PENDING_OTP → PENDING_SKILLS.
     *
     * Request body: VerifyOtpRequest { email, otp, purpose? }
     *
     * Response: 200 OK { success: true, message: "Email verified. Please select
     * your skills." }
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        authService.verifyOtp(request);

        return ResponseEntity.ok(ApiResponse.ok(
                "Email verified successfully. Please select the services you offer."));
    }

    // ── 4. Select Skills ──────────────────────────────────────
    /**
     * POST /api/provider/auth/select-skills
     *
     * Saves the provider's chosen service categories and activates the account.
     * Returns a JWT so the frontend can navigate directly to the provider
     * dashboard.
     *
     * Request body: SelectSkillsRequest { email, skills: ["Household",
     * "Repairs", ...] }
     *
     * Response: 200 OK { success: true, message: "Registration complete!",
     * data: { token, role, provider: { ... } } }
     */
    @PostMapping("/select-skills")
    public ResponseEntity<ApiResponse<AuthResponse>> selectSkills(
            @Valid @RequestBody SelectSkillsRequest request) {

        AuthResponse authResponse = authService.selectSkills(request);

        return ResponseEntity.ok(ApiResponse.ok(
                "Registration complete! Welcome to ServeNow.", authResponse));
    }

    // ── Sign In ───────────────────────────────────────────────
    /**
     * POST /api/provider/auth/signin
     *
     * Authenticates a provider with mobile + password. Matches user/SignIn.js
     * fields.
     *
     * Request body: ProviderSignInRequest { mobile, password }
     *
     * Response: 200 OK { success: true, message: "Signed in successfully.",
     * data: { token, role, provider: { ... } } }
     */
    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<AuthResponse>> signIn(
            @Valid @RequestBody ProviderSignInRequest request) {

        AuthResponse authResponse = authService.signIn(request);

        return ResponseEntity.ok(ApiResponse.ok("Signed in successfully.", authResponse));
    }

    // ── Check mobile exists (forgot password step 1) ──────────
    /**
     * POST /api/provider/auth/check-mobile Checks if the mobile number is
     * registered. If yes, sends OTP. Request body: SendOtpRequest { mobile,
     * purpose: "FORGOT_PASSWORD" }
     */
    @PostMapping("/check-mobile")
    public ResponseEntity<ApiResponse<Void>> checkMobile(
            @Valid @RequestBody SendOtpRequest request) {

        authService.checkMobileAndSendOtp(request.getMobile());

        return ResponseEntity.ok(ApiResponse.ok(
                "Mobile number verified. OTP sent to +91" + request.getMobile()));
    }

    // ── Reset password (forgot password step 2) ───────────────
    /**
     * POST /api/provider/auth/reset-password Verifies OTP and resets the
     * password. Request body: ForgotPasswordRequest { mobile, otp, newPassword
     * }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.resetPassword(request);

        return ResponseEntity.ok(ApiResponse.ok(
                "Password reset successfully. You can now sign in."));
    }
    // ── Verify mobile exists only (forgot password — no OTP) ──

    /**
     * POST /api/provider/auth/verify-mobile Only checks if the mobile number
     * exists in DB. Does NOT send any OTP.
     */
    @PostMapping("/verify-mobile")
    public ResponseEntity<ApiResponse<Void>> verifyMobile(
            @Valid @RequestBody SendOtpRequest request) {

        authService.verifyMobileExists(request.getMobile());

        return ResponseEntity.ok(ApiResponse.ok(
                "Mobile number verified. You may reset your password."));
    }
}
