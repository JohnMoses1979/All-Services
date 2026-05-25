package com.services.in.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request body for POST /api/provider/auth/select-skills.
 *
 * Sent after OTP verification — matches the "Continue" button action on
 * user/SelectServicesScreen.js. Contains the provider email (used to identify
 * which Labour record to update) and the list of selected skill category titles.
 *
 * Example skills: ["Household", "Repairs", "Personal Care"]
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelectSkillsRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    @NotNull(message = "Skills list is required")
    @Size(min = 1, message = "Select at least one skill category")
    private List<@NotBlank(message = "Skill name must not be blank") String> skills;
}
