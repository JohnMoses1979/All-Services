// package com.services.in.dto;
// import jakarta.validation.constraints.Email;
// import jakarta.validation.constraints.NotBlank;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;
// /**
//  * Request body for POST /api/provider/auth/send-otp. Used both for signup email
//  * verification and forgot-password flows.
//  */
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class SendOtpRequest {
//     @NotBlank(message = "Mobile number is required")
//     private String email;   // reused field — now carries mobile number
//     /**
//      * OTP purpose – must be one of: SIGNUP, FORGOT_PASSWORD, LOGIN_OTP.
//      * Defaults to SIGNUP if omitted or blank.
//      */
//     private String purpose;
// }
package com.services.in.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendOtpRequest {

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian mobile number")
    private String mobile;

    private String purpose;
}
