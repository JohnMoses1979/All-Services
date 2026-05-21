// // src/main/java/com/services/in/dto/ForgotPasswordRequest.java
// package com.services.in.dto;
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Pattern;
// import jakarta.validation.constraints.Size;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class ForgotPasswordRequest {
//     @NotBlank(message = "Mobile number is required")
//     @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian mobile number")
//     private String mobile;
//     @NotBlank(message = "New password is required")
//     @Size(min = 8, message = "Password must be at least 8 characters")
//     private String newPassword;
// // }
// package com.services.in.dto;
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Pattern;
// import jakarta.validation.constraints.Size;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;
// /**
//  * Request body for POST /api/provider/auth/reset-password
//  *
//  * OTP is verified in the preceding POST /api/provider/auth/verify-otp step and
//  * is NOT required here again. Sending otp in this request would cause a
//  * "Validation failed" error on the frontend because the frontend only sends {
//  * mobile, newPassword } after OTP has already been consumed.
//  */
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class ForgotPasswordRequest {
//     @NotBlank(message = "Mobile number is required")
//     @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian mobile number")
//     private String mobile;
//     @NotBlank(message = "New password is required")
//     @Size(min = 8, message = "Password must be at least 8 characters")
//     private String newPassword;
// }
package com.services.in.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequest {

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian mobile number")
    private String mobile;

    @NotBlank(message = "OTP is required")
    @Pattern(regexp = "^\\d{6}$", message = "OTP must consist of 6 digits only")
    private String otp;

    @NotBlank(message = "New password is required")
    @Size(min = 5, message = "Password must be at least 5 characters")
    private String newPassword;
}
