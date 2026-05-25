package com.services.in.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a Labour / Service Provider in the ServeNow platform. Mirrors the
 * provider fields used in the React Native frontend: user/SignUp.js,
 * user/SelectServicesScreen.js, user/SignIn.js
 */
@Entity
@Table(name = "ServiceProviders",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = "email"),
            @UniqueConstraint(columnNames = "mobile")
        })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * Full name shown in the provider profile and worker list cards
     */
    @Column(nullable = false, length = 100)
    private String fullName;
    /**
     * Derived two-letter initials used in avatar circles (e.g. "RK" for Ramesh
     * Kumar)
     */
    @Column(nullable = false, length = 5)
    private String initials;
    /**
     * Primary login credential — 10-digit Indian mobile (no country code
     * stored). Frontend sends it as "+91 XXXXXXXXXX" so we strip the prefix
     * before saving.
     */
    @Column(nullable = false, length = 15)
    private String mobile;
    /**
     * Email used for OTP delivery via Spring Mail
     */
    @Column(nullable = false, length = 150)
    private String email;
    /**
     * BCrypt-hashed password
     */
    @Column(nullable = false)
    private String password;
    /**
     * Service area / locality string (e.g. "Banjara Hills, Hyderabad")
     */
    @Column(length = 200)
    private String area;
    /**
     * Years of experience string, e.g. "3 Years Exp." Stored as string to match
     * the WorkerSummaryDto.experience field exactly.
     */
    @Column(length = 50)
    private String experience;
    /**
     * Comma-separated years integer, e.g. 3
     */
    private Integer experienceYears;

    /**
     * Average rating, computed from completed bookings
     */
    @Column(precision = 3)
    private Double rating;
    /**
     * Number of ratings/reviews received
     */
    private Integer reviews;
    /**
     * Badge label, e.g. "Top Rated", "New", "Verified"
     */
    @Column(length = 50)
    private String badge;
    /**
     * Badge colour hex, e.g. "#E8763A"
     */
    @Column(length = 20)
    private String badgeColor;
    /**
     * Whether the provider is currently accepting jobs
     */
    @Builder.Default
    private Boolean available = false;
    /**
     * Human-readable distance/location string, e.g. "1.2 km away"
     */
    @Column(length = 100)
    private String location;
    /**
     * Role is always PROVIDER for this module
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Role role = Role.PROVIDER;
    /**
     * Account state machine
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AccountStatus status = AccountStatus.PENDING_OTP;
    /**
     * Skills selected during the SelectServicesScreen step. Stored as a
     * separate table to allow querying by skill.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "service_provider_skills", joinColumns = @JoinColumn(name = "service_provider_id"))
    @Column(name = "skill", length = 100)
    @Builder.Default
    private List<String> skills = new ArrayList<>();
    /**
     * Timestamp of account creation
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    /**
     * Timestamp of last profile update
     */
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (initials == null && fullName != null) {
            initials = deriveInitials(fullName);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Derives "RK" from "Ramesh Kumar", max 2 chars
     */
    private static String deriveInitials(String name) {
        if (name == null || name.isBlank()) {
            return "??";
        }
        String[] parts = name.trim().split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        }
        return (String.valueOf(parts[0].charAt(0)) + String.valueOf(parts[parts.length - 1].charAt(0))).toUpperCase();
    }

    public enum Role {
        PROVIDER, CUSTOMER, ADMIN
    }

    public enum AccountStatus {
        /**
         * Email OTP sent but not yet verified
         */
        PENDING_OTP,
        /**
         * OTP verified but skills not yet selected
         */
        PENDING_SKILLS,
        /**
         * Fully registered and active
         */
        ACTIVE,
        /**
         * Suspended by admin
         */
        SUSPENDED
    }

    // ── KYC Documents (file paths on disk) ───────────────────
    /**
     * Relative path to the uploaded Aadhaar image, e.g.
     * "documents/provider_3/aadhaar.jpg"
     */
    @Column(length = 300)
    private String aadhaarPath;

    /**
     * Relative path to the uploaded PAN card image, e.g.
     * "documents/provider_3/pan.jpg"
     */
    @Column(length = 300)
    private String panPath;

    /**
     * KYC verification status set by admin: PENDING | VERIFIED | REJECTED
     */
    @Builder.Default
    @Column(length = 20)
    private String kycStatus = "PENDING";

    // Add these fields to ServiceProvider.java
    @Column(length = 10)
    private String dateOfBirth;

    @Column(length = 20)
    private String gender;

    @Column(length = 10)
    private String bloodGroup;

    @Column(length = 100)
    private String city;

    @Column(length = 50)
    private String state;

    @Column(length = 6)
    private String pinCode;

    @Column(length = 500)
    private String bio;

    @Column(length = 12)
    private String aadhaarNumber;

    @Column(length = 10)
    private String emergencyContact;

    @Column(length = 100)
    private String emergencyName;
}
