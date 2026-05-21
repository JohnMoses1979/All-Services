package com.services.in.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Provider profile DTO returned in API responses.
 *
 * Field names deliberately match: - WorkerSummaryDto in BACKEND-API-PLAN (for
 * worker list cards) - ProviderDto in BACKEND-API-PLAN (for provider dashboard)
 *
 * Used in AuthResponse, GET /api/provider/{id}, etc.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderDto {

    /**
     * Database PK — used as providerId / workerId in all provider endpoints
     */
    private Long id;

    private String fullName;

    /**
     * Two-letter initials, e.g. "RK"
     */
    private String initials;

    private String mobile;
    private String email;
    private String area;

    /**
     * Human-readable string, e.g. "3 Years Exp."
     */
    private String experience;

    private Double rating;
    private Integer reviews;

    /**
     * Badge label, e.g. "Top Rated"
     */
    private String badge;

    /**
     * Badge colour hex, e.g. "#E8763A"
     */
    private String badgeColor;

    private Boolean available;

    /**
     * Human-readable distance string, e.g. "1.2 km away"
     */
    private String location;

    /**
     * Always "PROVIDER" for this module
     */
    private String role;

    /**
     * Account state: PENDING_OTP | PENDING_SKILLS | ACTIVE | SUSPENDED
     */
    private String status;

    /**
     * Selected service category titles, e.g. ["Household", "Repairs"]
     */
    private List<String> skills;

    private String dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String city;
    private String state;
    private String pinCode;
    private String bio;
    private String aadhaarNumber;
    private String emergencyContact;
    private String emergencyName;
    private String kycStatus;
    private Integer experienceYears;
}
