// package com.services.in.dto;
// import jakarta.validation.constraints.Email;
// import jakarta.validation.constraints.Max;
// import jakarta.validation.constraints.Min;
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Pattern;
// import jakarta.validation.constraints.Size;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;
// /**
//  * Step 1 of provider signup — collects personal details. Matches the personal
//  * info fields in user/SignUp.js (step 0 & 1).
//  *
//  * Flow: POST /api/provider/auth/signup → sends OTP → verify OTP → select skills
//  * → active
//  */
// @Data
// @Builder
// @NoArgsConstructor
// @AllArgsConstructor
// public class ProviderSignUpRequest {
//     @NotBlank(message = "Full name is required")
//     @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
//     private String fullName;
//     /**
//      * 10-digit Indian mobile number (without country code). Frontend sends "+91
//      * XXXXXXXXXX", the service strips the prefix.
//      */
//     @NotBlank(message = "Mobile number is required")
//     @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian mobile number")
//     private String mobile;
//     @NotBlank(message = "Email is required")
//     @Email(message = "Enter a valid email address")
//     private String email;
//     @NotBlank(message = "Password is required")
//     @Size(min = 8, message = "Password must be at least 8 characters")
//     private String password;
//     /**
//      * Service area / locality, e.g. "Banjara Hills, Hyderabad"
//      */
//     @Size(max = 200, message = "Area must be under 200 characters")
//     private String area;
//     /**
//      * Optional years of experience (integer) at signup time
//      */
//     @Min(value = 0, message = "Experience years cannot be negative")
//     @Max(value = 60, message = "Experience years seems too high")
//     private Integer experienceYears;
//     // ── Document fields (base64 encoded) ──────────────────────
//     // Optional at signup — admin can verify later
//     private String aadhaarBase64;   // base64 string of the image
//     private String aadhaarMimeType; // e.g. "image/jpeg"
//     private String panBase64;
//     private String panMimeType;
// }
package com.services.in.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderSignUpRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100)
    private String fullName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian mobile number")
    private String mobile;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @Size(max = 200)
    private String area;

    @Min(0)
    @Max(60)
    private Integer experienceYears;

    // Documents come as MultipartFile via multipart/form-data
    private MultipartFile aadhaarFile;
    private MultipartFile panFile;
}
