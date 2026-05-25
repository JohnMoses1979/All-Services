package com.services.in.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnerProfileUpdateRequest {

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian mobile number")
    private String mobile;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String societyName;
    private String flatNo;
    private String address;
    private String profileImageUri;
    private String language;
    private String theme;
}
