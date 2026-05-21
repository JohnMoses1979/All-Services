// package com.services.in.dto;
// import jakarta.validation.constraints.Email;
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Pattern;
// import jakarta.validation.constraints.Size;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;
// /**
//  * Request body for POST /api/provider/auth/verify-otp.
//  */
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class VerifyOtpRequest {
//     @NotBlank(message = "Mobile number is required")
//     private String email;   // reused field — now carries mobile number
//     @NotBlank(message = "OTP is required")
//     @Size(min = 6, max = 6, message = "OTP must be exactly 6 digits")
//     @Pattern(regexp = "^\\d{6}$", message = "OTP must consist of 6 digits only")
//     private String otp;
//     /**
//      * Must match the purpose used when the OTP was sent. Defaults to SIGNUP if
//      * omitted.
//      */
//     private String purpose;
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
public class VerifyOtpRequest {

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian mobile number")
    private String mobile;

    @NotBlank(message = "OTP is required")
    @Size(min = 6, max = 6, message = "OTP must be exactly 6 digits")
    @Pattern(regexp = "^\\d{6}$", message = "OTP must consist of 6 digits only")
    private String otp;

    private String purpose;
}
