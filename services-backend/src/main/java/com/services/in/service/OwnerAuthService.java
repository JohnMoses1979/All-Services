package com.services.in.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.services.in.dto.ForgotPasswordRequest;
import com.services.in.dto.OwnerAuthResponse;
import com.services.in.dto.OwnerDto;
import com.services.in.dto.OwnerNotificationSettingsDto;
import com.services.in.dto.OwnerProfileUpdateRequest;
import com.services.in.dto.OwnerSignUpRequest;
import com.services.in.dto.OwnerVerifyOtpRequest;
import com.services.in.dto.ProviderSignInRequest;
import com.services.in.entity.OwnerAccount;
import com.services.in.entity.OtpToken;
import com.services.in.repository.OwnerAccountRepository;
import com.services.in.security.JwtUtil;

@Service
public class OwnerAuthService {

    private final OwnerAccountRepository ownerRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public OwnerAuthService(
            OwnerAccountRepository ownerRepository,
            OtpService otpService,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.ownerRepository = ownerRepository;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public void signUp(OwnerSignUpRequest request) {
        String mobile = normaliseMobile(request.getMobile());
        OwnerAccount existing = ownerRepository.findByMobile(mobile).orElse(null);
        if (existing != null && Boolean.TRUE.equals(existing.getMobileVerified())) {
            throw new IllegalArgumentException("This mobile number is already registered. Please login.");
        }

        if (existing != null) {
            existing.setFullName(request.getFullName().trim());
            existing.setSocietyName(trimToNull(request.getSocietyName()));
            existing.setFlatNo(trimToNull(request.getFlatNo()));
            existing.setAddress(trimToNull(request.getAddress()));
            existing.setPassword(passwordEncoder.encode(request.getPassword()));
            ownerRepository.save(existing);
            otpService.generateAndSend(mobile, OtpToken.OtpPurpose.SIGNUP);
            return;
        }

        OwnerAccount owner = OwnerAccount.builder()
                .fullName(request.getFullName().trim())
                .mobile(mobile)
                .societyName(trimToNull(request.getSocietyName()))
                .flatNo(trimToNull(request.getFlatNo()))
                .address(trimToNull(request.getAddress()))
                .language("en")
                .theme("light")
                .mobileVerified(false)
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        ownerRepository.save(owner);
        otpService.generateAndSend(mobile, OtpToken.OtpPurpose.SIGNUP);
    }

    @Transactional
    public OwnerDto verifySignupOtp(OwnerVerifyOtpRequest request) {
        String mobile = normaliseMobile(request.getMobile());
        OwnerAccount owner = ownerRepository.findByMobile(mobile)
                .orElseThrow(() -> new IllegalArgumentException(
                "This mobile number is not registered. Please sign up first."));

        otpService.verify(mobile, request.getOtp(), OtpToken.OtpPurpose.SIGNUP);
        owner.setMobileVerified(true);
        return OwnerDto.from(ownerRepository.save(owner));
    }

    @Transactional(readOnly = true)
    public OwnerAuthResponse signIn(ProviderSignInRequest request) {
        String mobile = normaliseMobile(request.getMobile());
        OwnerAccount owner = ownerRepository.findByMobile(mobile)
                .orElseThrow(() -> new IllegalArgumentException(
                "This mobile number is not registered. Please sign up first."));

        if (!Boolean.TRUE.equals(owner.getMobileVerified())) {
            throw new IllegalArgumentException("Please verify your mobile number with OTP before signing in.");
        }

        if (!passwordEncoder.matches(request.getPassword(), owner.getPassword())) {
            throw new IllegalArgumentException("Incorrect password. Please try again.");
        }

        String token = jwtUtil.generateToken(owner.getMobile(), owner.getId(), "OWNER");
        return OwnerAuthResponse.builder()
                .token(token)
                .role("OWNER")
                .owner(OwnerDto.from(owner))
                .build();
    }

    @Transactional(readOnly = true)
    public OwnerDto getProfile(String mobile) {
        return OwnerDto.from(ownerRepository.findByMobile(normaliseMobile(mobile))
                .orElseThrow(() -> new IllegalArgumentException("Owner profile not found.")));
    }

    @Transactional
    public OwnerDto updateProfile(OwnerProfileUpdateRequest request) {
        OwnerAccount owner = ownerRepository.findByMobile(normaliseMobile(request.getMobile()))
                .orElseThrow(() -> new IllegalArgumentException("Owner profile not found."));
        owner.setFullName(request.getFullName().trim());
        owner.setSocietyName(trimToNull(request.getSocietyName()));
        owner.setFlatNo(trimToNull(request.getFlatNo()));
        owner.setAddress(trimToNull(request.getAddress()));
        owner.setProfileImageUri(trimToNull(request.getProfileImageUri()));
        owner.setLanguage(normaliseChoice(request.getLanguage(), "en"));
        owner.setTheme(normaliseChoice(request.getTheme(), "light"));
        return OwnerDto.from(ownerRepository.save(owner));
    }

    @Transactional(readOnly = true)
    public OwnerNotificationSettingsDto getNotificationSettings(String mobile) {
        OwnerAccount owner = ownerRepository.findByMobile(normaliseMobile(mobile))
                .orElseThrow(() -> new IllegalArgumentException("Owner profile not found."));
        return OwnerNotificationSettingsDto.from(owner);
    }

    @Transactional
    public OwnerNotificationSettingsDto updateNotificationSettings(
            String mobile,
            OwnerNotificationSettingsDto request) {
        OwnerAccount owner = ownerRepository.findByMobile(normaliseMobile(mobile))
                .orElseThrow(() -> new IllegalArgumentException("Owner profile not found."));

        OwnerNotificationSettingsDto current = OwnerNotificationSettingsDto.from(owner);
        OwnerNotificationSettingsDto next = request == null ? current : request;
        owner.setNotifyBookingConfirmations(booleanOrCurrent(
                next.getBookingConfirmations(), current.getBookingConfirmations()));
        owner.setNotifyBookingReminders(booleanOrCurrent(
                next.getBookingReminders(), current.getBookingReminders()));
        owner.setNotifyBookingCancellations(booleanOrCurrent(
                next.getBookingCancellations(), current.getBookingCancellations()));
        owner.setNotifyOffersDiscounts(booleanOrCurrent(
                next.getOffersDiscounts(), current.getOffersDiscounts()));
        owner.setNotifyNewServices(booleanOrCurrent(
                next.getNewServices(), current.getNewServices()));
        owner.setNotifyWalletUpdates(booleanOrCurrent(
                next.getWalletUpdates(), current.getWalletUpdates()));
        owner.setNotifyReferEarnUpdates(booleanOrCurrent(
                next.getReferEarnUpdates(), current.getReferEarnUpdates()));

        return OwnerNotificationSettingsDto.from(ownerRepository.save(owner));
    }

    @Transactional
    public void checkMobileAndSendOtp(String mobile) {
        String normalised = normaliseMobile(mobile);
        ownerRepository.findByMobile(normalised)
                .orElseThrow(() -> new IllegalArgumentException(
                "This mobile number is not registered. Please sign up first."));
        otpService.generateAndSend(normalised, OtpToken.OtpPurpose.FORGOT_PASSWORD);
    }

    @Transactional
    public void resetPassword(ForgotPasswordRequest request) {
        String mobile = normaliseMobile(request.getMobile());
        OwnerAccount owner = ownerRepository.findByMobile(mobile)
                .orElseThrow(() -> new IllegalArgumentException(
                "This mobile number is not registered. Please sign up first."));

        otpService.verify(mobile, request.getOtp(), OtpToken.OtpPurpose.FORGOT_PASSWORD);
        owner.setPassword(passwordEncoder.encode(request.getNewPassword()));
        ownerRepository.save(owner);
    }

    private String normaliseMobile(String mobile) {
        if (mobile == null) {
            return "";
        }
        return mobile.replaceAll("\\s+", "").replaceFirst("^\\+91", "");
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private String normaliseChoice(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim().toLowerCase();
    }

    private Boolean booleanOrCurrent(Boolean value, Boolean current) {
        return value == null ? current : value;
    }
}
