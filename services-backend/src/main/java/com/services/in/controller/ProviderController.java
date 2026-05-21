package com.services.in.controller;

import com.services.in.dto.ApiResponse;
import com.services.in.dto.AdminDepartmentDto;
import com.services.in.dto.ProviderDto;
import com.services.in.dto.ServiceCategoryDto;
import com.services.in.dto.UpdateProfileRequest;
import com.services.in.service.ProviderAuthService;
import com.services.in.service.ServiceCategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for authenticated provider endpoints.
 *
 * Base URL: /api/provider
 *
 * All endpoints here require a valid JWT with role PROVIDER, except GET
 * /categories which is public (needed during registration).
 *
 * Matches Developer 3 responsibilities from the API plan: GET
 * /providers/{providerId} GET /api/provider/me (convenience — returns own
 * profile from JWT) GET /api/provider/categories (public — service categories
 * for skill selection)
 */
@RestController
@RequestMapping("/api/provider")
public class ProviderController {

    private final ProviderAuthService authService;
    private final ServiceCategoryService categoryService;

    public ProviderController(ProviderAuthService authService,
            ServiceCategoryService categoryService) {
        this.authService = authService;
        this.categoryService = categoryService;
    }

    // ── Service categories (public) ────────────────────────────
    /**
     * GET /api/provider/categories
     *
     * Returns the list of service categories shown on SelectServicesScreen.js.
     * This endpoint is publicly accessible so it can be called before the
     * provider has a JWT (i.e. during registration step 3).
     *
     * Response: 200 OK { success: true, data: [ { id, icon, title, description
     * }, ... ] }
     */
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<ServiceCategoryDto>>> getCategories() {
        List<ServiceCategoryDto> categories = categoryService.getAllActive();
        return ResponseEntity.ok(ApiResponse.ok("Categories fetched successfully.", categories));
    }

    @GetMapping("/admin/departments")
    public ResponseEntity<ApiResponse<List<AdminDepartmentDto>>> getAdminDepartments() {
        List<AdminDepartmentDto> departments = authService.getAdminDepartments();
        return ResponseEntity.ok(ApiResponse.ok("Departments fetched successfully.", departments));
    }

    @GetMapping("/admin/providers")
    public ResponseEntity<ApiResponse<List<ProviderDto>>> getAdminProvidersBySkill(
            @RequestParam String skill) {
        List<ProviderDto> providers = authService.getProvidersBySkill(skill);
        return ResponseEntity.ok(ApiResponse.ok("Providers fetched successfully.", providers));
    }

    @GetMapping("/public/providers")
    public ResponseEntity<ApiResponse<List<ProviderDto>>> getPublicProvidersBySkill(
            @RequestParam String skill) {
        List<ProviderDto> providers = authService.getProvidersBySkill(skill);
        return ResponseEntity.ok(ApiResponse.ok("Online providers fetched successfully.", providers));
    }

    // ── Provider profile (authenticated) ──────────────────────
    /**
     * GET /api/provider/me
     *
     * Returns the authenticated provider's own profile. Extracted from the JWT
     * subject (email).
     *
     * Requires: Authorization: Bearer <token>
     *
     * Response: 200 OK { success: true, data: { id, fullName, skills, status,
     * ... } }
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<ProviderDto>> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        // userDetails.getUsername() returns the email (used as JWT subject)
        String email = userDetails.getUsername();
        ProviderDto provider = authService.getProfile(
                // Look up by email — delegate to a helper that finds by email
                authService.findIdByEmail(email)
        );

        return ResponseEntity.ok(ApiResponse.ok("Profile fetched.", provider));
    }

    /**
     * GET /api/provider/{providerId}
     *
     * Returns a provider's public profile by numeric ID. Used by the
     * customer-facing worker detail screens.
     *
     * Requires: Authorization: Bearer <token>
     *
     * Response: 200 OK { success: true, data: ProviderDto }
     */
    @GetMapping("/{providerId}")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProviderDto>> getProvider(
            @PathVariable Long providerId) {

        ProviderDto provider = authService.getProfile(providerId);
        return ResponseEntity.ok(ApiResponse.ok("Provider fetched.", provider));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<ProviderDto>> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {

        String email = userDetails.getUsername();
        Long providerId = authService.findIdByEmail(email);
        ProviderDto updated = authService.updateProfile(providerId, request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully.", updated));
    }
}
