package com.services.in.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.services.in.dto.AdminDepartmentDto;
import com.services.in.dto.AuthResponse;
import com.services.in.dto.ForgotPasswordRequest;
import com.services.in.dto.ProviderDto;
import com.services.in.dto.ProviderSignInRequest;
import com.services.in.dto.ProviderSignUpRequest;
import com.services.in.dto.SelectSkillsRequest;
import com.services.in.dto.UpdateProfileRequest;
import com.services.in.dto.VerifyOtpRequest;
import com.services.in.entity.OtpToken;
import com.services.in.entity.ServiceProvider;
import com.services.in.exception.AccountStateException;
import com.services.in.exception.InvalidCredentialsException;
import com.services.in.exception.InvalidOtpException;
import com.services.in.exception.ProviderAlreadyExistsException;
import com.services.in.exception.ProviderNotFoundException;
import com.services.in.repository.ServiceProviderRepository;
import com.services.in.security.JwtUtil;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Core service orchestrating the provider (labour) authentication flow:
 *
 * Step 1 – POST /api/provider/auth/signup Create account with status
 * PENDING_OTP Trigger OTP email (via OtpService → EmailService)
 *
 * Step 2 – POST /api/provider/auth/verify-otp Verify OTP, advance status to
 * PENDING_SKILLS
 *
 * Step 3 – POST /api/provider/auth/select-skills Save skill selection, advance
 * status to ACTIVE Return JWT so the provider is logged in immediately
 *
 * Sign In – POST /api/provider/auth/signin Mobile + password → JWT
 */
@Service
public class ProviderAuthService {

    private final ServiceProviderRepository labourRepository;
    private final OtpService otpService;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    // ✅ FIX: Removed `ServiceProvider labour` from constructor — JPA entities
    //         are NOT Spring beans and cannot be injected via constructor.
    public ProviderAuthService(ServiceProviderRepository labourRepository,
            OtpService otpService,
            EmailService emailService,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder,
            FileStorageService fileStorageService) {
        this.labourRepository = labourRepository;
        this.otpService = otpService;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
    }

    // ── Step 1: Signup ────────────────────────────────────────
    /**
     * Registers a new provider. Normalises the mobile number (strips country
     * prefix), hashes the password, saves with PENDING_OTP status, and fires an
     * OTP to the given email.
     *
     * @throws ProviderAlreadyExistsException if email or mobile is already
     * registered
     */
    @Transactional
    public void signUp(ProviderSignUpRequest request) {
        String mobile = normaliseMobile(request.getMobile());
        String email = request.getEmail().toLowerCase().trim();

        if (labourRepository.existsByEmail(email)) {
            throw new ProviderAlreadyExistsException(
                    "An account with this email already exists.");
        }
        if (labourRepository.existsByMobile(mobile)) {
            throw new ProviderAlreadyExistsException(
                    "An account with this mobile number already exists.");
        }

        String experienceStr = request.getExperienceYears() != null
                ? request.getExperienceYears() + " Years Exp." : null;

        // Save provider first to get the generated DB id
        ServiceProvider labour = ServiceProvider.builder()
                .fullName(request.getFullName().trim())
                .mobile(mobile)
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .area(request.getArea())
                .experienceYears(request.getExperienceYears())
                .experience(experienceStr)
                .role(ServiceProvider.Role.PROVIDER)
                .status(ServiceProvider.AccountStatus.PENDING_OTP)
                .available(false)
                .rating(0.0)
                .reviews(0)
                .kycStatus("PENDING")
                .build();

        labour = labourRepository.save(labour); // get ID now

        // Save documents using the provider's real DB id
        try {
            if (request.getAadhaarFile() != null && !request.getAadhaarFile().isEmpty()) {
                String aadhaarPath = fileStorageService.saveDocument(
                        labour.getId(), request.getAadhaarFile(), "aadhaar");
                labour.setAadhaarPath(aadhaarPath);
            }
            if (request.getPanFile() != null && !request.getPanFile().isEmpty()) {
                String panPath = fileStorageService.saveDocument(
                        labour.getId(), request.getPanFile(), "pan");
                labour.setPanPath(panPath);
            }
            labourRepository.save(labour); // update with file paths
        } catch (Exception ex) {
            // Rollback: delete saved files and the DB record
            fileStorageService.deleteProviderFolder(labour.getId());
            labourRepository.delete(labour);
            throw new RuntimeException("Document upload failed: " + ex.getMessage());
        }

        otpService.generateAndSend(mobile, OtpToken.OtpPurpose.SIGNUP);
    }

    // ── Resend OTP ────────────────────────────────────────────
    /**
     * Re-sends an OTP for the given email + purpose. The previous OTP is
     * automatically invalidated by OtpService.
     *
     * @throws ProviderNotFoundException if email not registered (for non-SIGNUP
     * purpose)
     */
    @Transactional
    public void sendOtp(String mobile, String purposeStr) {
        OtpToken.OtpPurpose purpose = parsePurpose(purposeStr);
        String normalised = normaliseMobile(mobile);

        if (purpose != OtpToken.OtpPurpose.SIGNUP) {
            labourRepository.findByMobile(normalised)
                    .orElseThrow(() -> new ProviderNotFoundException(
                    "No account found with this mobile number."));
        }

        otpService.generateAndSend(normalised, purpose);
    }

    // ── Step 2: Verify OTP ────────────────────────────────────
    /**
     * Verifies the OTP the provider entered. On success, advances the account
     * from PENDING_OTP → PENDING_SKILLS.
     *
     * @throws ProviderNotFoundException if the email is not registered
     * @throws InvalidOtpException if the OTP is wrong / expired / used
     * @throws AccountStateException if the account is not in PENDING_OTP state
     */
    @Transactional
    public void verifyOtp(VerifyOtpRequest request) {
        String mobile = normaliseMobile(request.getMobile());
        OtpToken.OtpPurpose purpose = parsePurpose(request.getPurpose());

        ServiceProvider labour = labourRepository.findByMobile(mobile)
                .orElseThrow(() -> new ProviderNotFoundException(
                "No account found with this mobile number."));

        if (purpose == OtpToken.OtpPurpose.SIGNUP
                && labour.getStatus() != ServiceProvider.AccountStatus.PENDING_OTP) {
            throw new AccountStateException(
                    "Account is not awaiting OTP verification. Current status: "
                    + labour.getStatus());
        }

        otpService.verify(mobile, request.getOtp(), purpose);

        if (purpose == OtpToken.OtpPurpose.SIGNUP) {
            labour.setStatus(ServiceProvider.AccountStatus.PENDING_SKILLS);
            labourRepository.save(labour);
        }
    }

    // ── Step 3: Select Skills ─────────────────────────────────
    /**
     * Saves the provider's chosen skill categories and activates the account.
     * Returns a JWT so the frontend can navigate directly to the provider home
     * screen.
     *
     * @throws ProviderNotFoundException if the email is not registered
     * @throws AccountStateException if the account has not verified its OTP yet
     */
    @Transactional
    public AuthResponse selectSkills(SelectSkillsRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        ServiceProvider labour = labourRepository.findByEmail(email)
                .orElseThrow(() -> new ProviderNotFoundException(
                "No account found with this email address."));

        if (labour.getStatus() != ServiceProvider.AccountStatus.PENDING_SKILLS) {
            throw new AccountStateException(
                    "Account cannot select skills in its current state: "
                    + labour.getStatus());
        }

        labour.setSkills(request.getSkills());
        labour.setStatus(ServiceProvider.AccountStatus.ACTIVE);
        labourRepository.save(labour);

        // Send welcome email asynchronously
        emailService.sendWelcomeEmail(labour.getEmail(), labour.getFullName());

        // Issue JWT — provider is now logged in
        String token = jwtUtil.generateToken(labour.getEmail(), labour.getId(), "PROVIDER");
        return AuthResponse.builder()
                .token(token)
                .role("PROVIDER")
                .provider(toDto(labour))
                .build();
    }

    // ── Sign In ───────────────────────────────────────────────
    /**
     * Authenticates a provider using mobile number + password. Returns a JWT on
     * success.
     *
     * @throws InvalidCredentialsException if mobile not found or password
     * incorrect
     * @throws AccountStateException if account is not ACTIVE
     */
    @Transactional(readOnly = true)
    public AuthResponse signIn(ProviderSignInRequest request) {
        String mobile = normaliseMobile(request.getMobile());

        ServiceProvider labour = labourRepository.findByMobile(mobile)
                .orElseThrow(() -> new InvalidCredentialsException(
                "Invalid mobile number or password."));

        if (!passwordEncoder.matches(request.getPassword(), labour.getPassword())) {
            throw new InvalidCredentialsException(
                    "Invalid mobile number or password.");
        }

        if (labour.getStatus() == ServiceProvider.AccountStatus.PENDING_OTP) {
            throw new AccountStateException(
                    "Please verify your email OTP before signing in.");
        }

        if (labour.getStatus() == ServiceProvider.AccountStatus.PENDING_SKILLS) {
            throw new AccountStateException(
                    "Please complete skill selection before signing in.");
        }

        if (labour.getStatus() == ServiceProvider.AccountStatus.SUSPENDED) {
            throw new AccountStateException(
                    "Your account has been suspended. Please contact support.");
        }

        String token = jwtUtil.generateToken(labour.getEmail(), labour.getId(), "PROVIDER");
        return AuthResponse.builder()
                .token(token)
                .role("PROVIDER")
                .provider(toDto(labour))
                .build();
    }

    // ── Provider profile ──────────────────────────────────────
    /**
     * Returns the public profile of a provider by ID.
     */
    @Transactional(readOnly = true)
    public ProviderDto getProfile(Long providerId) {
        ServiceProvider labour = labourRepository.findById(providerId)
                .orElseThrow(() -> new ProviderNotFoundException(
                "Provider not found with id: " + providerId));
        return toDto(labour);
    }

    @Transactional(readOnly = true)
    public List<AdminDepartmentDto> getAdminDepartments() {
        Map<String, List<ServiceProvider>> providersBySkill = new LinkedHashMap<>();

        labourRepository.findAll().stream()
                .filter(provider -> provider.getStatus() == ServiceProvider.AccountStatus.ACTIVE)
                .filter(provider -> provider.getSkills() != null && !provider.getSkills().isEmpty())
                .forEach(provider -> provider.getSkills().forEach(skill -> {
            String normalisedSkill = skill == null ? "" : skill.trim();
            if (!normalisedSkill.isBlank()) {
                providersBySkill.computeIfAbsent(normalisedSkill, ignored -> new java.util.ArrayList<>())
                        .add(provider);
            }
        }));

        return providersBySkill.entrySet().stream()
                .map(entry -> AdminDepartmentDto.builder()
                .id(entry.getKey().toLowerCase().replaceAll("[^a-z0-9]+", "-"))
                .name(entry.getKey())
                .workers(entry.getValue().size())
                .pending(entry.getValue().stream()
                        .filter(provider -> "PENDING".equalsIgnoreCase(provider.getKycStatus()))
                        .count())
                .build())
                .sorted(Comparator.comparing(AdminDepartmentDto::getName))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProviderDto> getProvidersBySkill(String skill) {
        return labourRepository.findOnlineActiveBySkill(skill).stream()
                .map(this::toDto)
                .toList();
    }

    // ── Convenience lookup ────────────────────────────────────
    /**
     * Returns the numeric ID for a provider email. Used by
     * ProviderController.getMyProfile to resolve the JWT subject to a DB id.
     */
    @Transactional(readOnly = true)
    public Long findIdByEmail(String email) {
        return labourRepository.findByEmail(email)
                .orElseThrow(() -> new ProviderNotFoundException(
                "Provider not found with email: " + email))
                .getId();
    }

    // ── Mappers ───────────────────────────────────────────────
    public ProviderDto toDto(ServiceProvider labour) {
        return ProviderDto.builder()
                .id(labour.getId())
                .fullName(labour.getFullName())
                .initials(labour.getInitials())
                .mobile(labour.getMobile())
                .email(labour.getEmail())
                .area(labour.getArea())
                .city(labour.getCity())
                .state(labour.getState())
                .pinCode(labour.getPinCode())
                .dateOfBirth(labour.getDateOfBirth())
                .gender(labour.getGender())
                .bloodGroup(labour.getBloodGroup())
                .bio(labour.getBio())
                .aadhaarNumber(labour.getAadhaarNumber())
                .emergencyContact(labour.getEmergencyContact())
                .emergencyName(labour.getEmergencyName())
                .experience(labour.getExperience())
                .experienceYears(labour.getExperienceYears())
                .rating(labour.getRating())
                .reviews(labour.getReviews())
                .badge(labour.getBadge())
                .badgeColor(labour.getBadgeColor())
                .available(labour.getAvailable())
                .location(labour.getLocation())
                .role(labour.getRole().name())
                .status(labour.getStatus().name())
                .kycStatus(labour.getKycStatus())
                .skills(labour.getSkills())
                .build();
    }

    // ── Utilities ─────────────────────────────────────────────
    /**
     * Strips "+91 " or "+91" prefix that the frontend may include and removes
     * all whitespace, returning a clean 10-digit number.
     */
    private String normaliseMobile(String raw) {
        if (raw == null) {
            return "";
        }
        return raw.trim()
                .replaceAll("^\\+91\\s?", "")
                .replaceAll("\\s", "");
    }

    private OtpToken.OtpPurpose parsePurpose(String purposeStr) {
        if (purposeStr == null || purposeStr.isBlank()) {
            return OtpToken.OtpPurpose.SIGNUP;
        }
        try {
            return OtpToken.OtpPurpose.valueOf(purposeStr.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return OtpToken.OtpPurpose.SIGNUP;
        }
    }

    @Transactional
    public ProviderDto updateProfile(Long providerId, UpdateProfileRequest request) {
        ServiceProvider provider = labourRepository.findById(providerId)
                .orElseThrow(() -> new ProviderNotFoundException(
                "Provider not found with id: " + providerId));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            provider.setFullName(request.getFullName().trim());
        }
        if (request.getArea() != null) {
            provider.setArea(request.getArea().trim());
        }
        if (request.getCity() != null) {
            provider.setCity(request.getCity().trim());
        }
        if (request.getState() != null) {
            provider.setState(request.getState().trim());
        }
        if (request.getPinCode() != null) {
            provider.setPinCode(request.getPinCode().trim());
        }
        if (request.getDateOfBirth() != null) {
            provider.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getGender() != null) {
            provider.setGender(request.getGender());
        }
        if (request.getBloodGroup() != null) {
            provider.setBloodGroup(request.getBloodGroup());
        }
        if (request.getBio() != null) {
            provider.setBio(request.getBio().trim());
        }
        if (request.getAadhaarNumber() != null) {
            provider.setAadhaarNumber(request.getAadhaarNumber().trim());
        }
        if (request.getEmergencyContact() != null) {
            provider.setEmergencyContact(request.getEmergencyContact().trim());
        }
        if (request.getEmergencyName() != null) {
            provider.setEmergencyName(request.getEmergencyName().trim());
        }
        if (request.getExperienceYears() != null) {
            provider.setExperienceYears(request.getExperienceYears());
            provider.setExperience(request.getExperienceYears() + " Years Exp.");
        }
        if (request.getSkills() != null) {
            provider.setSkills(request.getSkills());
        }
        if (request.getAvailable() != null) {
            provider.setAvailable(request.getAvailable());
        }

        labourRepository.save(provider);
        return toDto(provider);
    }

    // ── Forgot Password: Step 1 ───────────────────────────────
    /**
     * Checks if mobile is registered, then sends FORGOT_PASSWORD OTP via SMS.
     */
    @Transactional
    public void checkMobileAndSendOtp(String mobile) {
        String normalised = normaliseMobile(mobile);

        // Throws ProviderNotFoundException if not found — frontend shows error
        labourRepository.findByMobile(normalised)
                .orElseThrow(() -> new ProviderNotFoundException(
                "No account found with this mobile number. Please register first."));

        otpService.generateAndSend(normalised, OtpToken.OtpPurpose.FORGOT_PASSWORD);
    }

    // ── Forgot Password: Step 2 (reset-password endpoint) ────
    /**
     * Resets the provider's password.
     *
     * The FORGOT_PASSWORD OTP was already verified and marked as `used=true` by
     * the preceding POST /verify-otp call. Calling otpService.verify() here a
     * second time would always throw InvalidOtpException("already used"), which
     * is exactly what caused the "Validation failed" / error banner on the
     * Reset Password screen.
     *
     * Flow: 1. POST /check-mobile → validates mobile exists, sends OTP via SMS
     * 2. POST /verify-otp → verifies OTP, marks token used=true 3. POST
     * /reset-password → (this method) sets new hashed password ✅
     */
    // ── Forgot Password: Step 2 ───────────────────────────────
    @Transactional
    public void resetPassword(ForgotPasswordRequest request) {
        String normalised = normaliseMobile(request.getMobile());

        ServiceProvider provider = labourRepository.findByMobile(normalised)
                .orElseThrow(() -> new ProviderNotFoundException(
                "No account found with this mobile number."));
        otpService.verify(normalised, request.getOtp(), OtpToken.OtpPurpose.FORGOT_PASSWORD);

        provider.setPassword(passwordEncoder.encode(request.getNewPassword()));
        labourRepository.save(provider);
    }

    // ── Forgot Password: Check mobile only (no OTP sent) ─────
    /**
     * Verifies the mobile number exists in the database. Does NOT trigger any
     * OTP or SMS.
     */
    @Transactional(readOnly = true)
    public void verifyMobileExists(String mobile) {
        String normalised = normaliseMobile(mobile);
        labourRepository.findByMobile(normalised)
                .orElseThrow(() -> new ProviderNotFoundException(
                "This mobile number is not registered. Please sign up first."));
    }
}
