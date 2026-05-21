package com.services.in.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import lombok.NoArgsConstructor;

/**
 * Uniform API response envelope used for all endpoints.
 *
 * Success example:
 * {
 *   "success": true,
 *   "message": "OTP sent successfully",
 *   "data": null
 * }
 *
 * Error example:
 * {
 *   "success": false,
 *   "message": "OTP has expired. Please request a new one.",
 *   "data": null
 * }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    // ── Static factory helpers ──────────────────────────────────
    public static <T> ApiResponse<T> ok(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> ok(String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .build();
    }
}
