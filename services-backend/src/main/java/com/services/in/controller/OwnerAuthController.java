package com.services.in.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.services.in.dto.ApiResponse;
import com.services.in.dto.ForgotPasswordRequest;
import com.services.in.dto.OwnerAuthResponse;
import com.services.in.dto.OwnerDto;
import com.services.in.dto.OwnerNotificationSettingsDto;
import com.services.in.dto.OwnerProfileUpdateRequest;
import com.services.in.dto.OwnerSignUpRequest;
import com.services.in.dto.OwnerVerifyOtpRequest;
import com.services.in.dto.ProviderSignInRequest;
import com.services.in.dto.SendOtpRequest;
import com.services.in.service.OwnerAuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/owner/auth")
public class OwnerAuthController {

    private final OwnerAuthService ownerAuthService;

    public OwnerAuthController(OwnerAuthService ownerAuthService) {
        this.ownerAuthService = ownerAuthService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signUp(
            @Valid @RequestBody OwnerSignUpRequest request) {
        ownerAuthService.signUp(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Owner account created. OTP sent to +91" + request.getMobile()));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<OwnerDto>> verifyOtp(
            @Valid @RequestBody OwnerVerifyOtpRequest request) {
        OwnerDto owner = ownerAuthService.verifySignupOtp(request);
        return ResponseEntity.ok(ApiResponse.ok(
                "Welcome " + owner.getFullName() + ". Your mobile number is verified. Please sign in.",
                owner));
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<OwnerAuthResponse>> signIn(
            @Valid @RequestBody ProviderSignInRequest request) {
        OwnerAuthResponse response = ownerAuthService.signIn(request);
        return ResponseEntity.ok(ApiResponse.ok("Signed in successfully.", response));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<OwnerDto>> getProfile(
            @RequestParam String mobile) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Owner profile loaded.",
                ownerAuthService.getProfile(mobile)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<OwnerDto>> updateProfile(
            @Valid @RequestBody OwnerProfileUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Owner profile updated.",
                ownerAuthService.updateProfile(request)));
    }

    @GetMapping("/notification-settings")
    public ResponseEntity<ApiResponse<OwnerNotificationSettingsDto>> getNotificationSettings(
            @RequestParam String mobile) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Notification settings loaded.",
                ownerAuthService.getNotificationSettings(mobile)));
    }

    @PutMapping("/notification-settings")
    public ResponseEntity<ApiResponse<OwnerNotificationSettingsDto>> updateNotificationSettings(
            @RequestParam String mobile,
            @RequestBody OwnerNotificationSettingsDto request) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Notification settings updated.",
                ownerAuthService.updateNotificationSettings(mobile, request)));
    }

    @PostMapping("/check-mobile")
    public ResponseEntity<ApiResponse<Void>> checkMobile(
            @Valid @RequestBody SendOtpRequest request) {
        ownerAuthService.checkMobileAndSendOtp(request.getMobile());
        return ResponseEntity.ok(ApiResponse.ok(
                "Mobile number verified. OTP sent to +91" + request.getMobile()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        ownerAuthService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok(
                "Password reset successfully. You can now sign in."));
    }
}


  