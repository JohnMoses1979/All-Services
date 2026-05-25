package com.services.in.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.services.in.entity.OtpToken;
import com.services.in.exception.InvalidOtpException;
import com.services.in.repository.OtpTokenRepository;

/**
 * Manages the full OTP lifecycle: 1. generateAndSend – creates a random 6-digit
 * OTP, persists it, fires email 2. verify – checks the OTP is correct, unused,
 * and not expired
 *
 * A new OTP request automatically invalidates any previous OTPs for the same
 * email + purpose combination to prevent replay attacks.
 */
@Service
public class OtpService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final OtpTokenRepository otpTokenRepository;
    private final SmsService smsService;

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    @Value("${app.sms.fail-on-error:false}")
    private boolean failOnSmsError;

    public OtpService(OtpTokenRepository otpTokenRepository, SmsService smsService) {
        this.otpTokenRepository = otpTokenRepository;
        this.smsService = smsService;
    }

    /**
     * Generates OTP keyed by mobile number instead of email. The `email` field
     * in OtpToken is reused to store mobile for simplicity.
     */
    @Transactional
    public void generateAndSend(String mobile, OtpToken.OtpPurpose purpose) {
        otpTokenRepository.invalidatePreviousOtps(mobile, purpose);
        String otp = generateSixDigitOtp();
        OtpToken token = OtpToken.builder()
                .email(mobile) // reusing email column to store mobile
                .token(otp)
                .purpose(purpose)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes))
                .used(false)
                .build();
        otpTokenRepository.save(token);
        try {
            smsService.sendOtpSms(mobile, otp, otpExpiryMinutes, purposeLabel(purpose));
        } catch (RuntimeException ex) {
            System.err.println("SMS OTP send failed for " + mobile + ": " + ex.getMessage());
            System.err.println("Development OTP for " + mobile + " (" + purposeLabel(purpose) + "): " + otp);
            if (failOnSmsError) {
                throw ex;
            }
        }
    }

    /**
     * Verifies the supplied OTP against the stored value. Marks the token as
     * used upon success.
     *
     * @param email email the OTP was sent to
     * @param otp the 6-digit code the user entered
     * @param purpose must match the purpose used during generation
     * @throws InvalidOtpException if the OTP is wrong, expired, or already used
     */
    @Transactional
    public void verify(String email, String otp, OtpToken.OtpPurpose purpose) {
        OtpToken stored = otpTokenRepository
                .findLatestValidOtp(email, purpose)
                .orElseThrow(() -> new InvalidOtpException(
                "No active OTP found for this email. Please request a new one."));

        if (stored.isExpired()) {
            throw new InvalidOtpException(
                    "OTP has expired. Please request a new one.");
        }

        if (stored.getUsed()) {
            throw new InvalidOtpException(
                    "This OTP has already been used. Please request a new one.");
        }

        if (!stored.getToken().equals(otp)) {
            throw new InvalidOtpException(
                    "Incorrect OTP. Please check the code sent to your email.");
        }

        // Mark as used so it cannot be replayed
        stored.setUsed(true);
        otpTokenRepository.save(stored);
    }

    // ── Helpers ───────────────────────────────────────────────
    /**
     * Generates a cryptographically secure 6-digit numeric OTP
     */
    private String generateSixDigitOtp() {
        int otpInt = 100_000 + SECURE_RANDOM.nextInt(900_000);
        return String.valueOf(otpInt);
    }

    private String purposeLabel(OtpToken.OtpPurpose purpose) {
        return switch (purpose) {
            case SIGNUP ->
                "account verification";
            case FORGOT_PASSWORD ->
                "password reset";
            case LOGIN_OTP ->
                "login";
        };
    }
}
