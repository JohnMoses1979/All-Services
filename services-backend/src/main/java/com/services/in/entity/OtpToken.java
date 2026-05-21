package com.services.in.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
/**
 * Stores the one-time password (OTP) sent to the provider's email.
 * Each new OTP request invalidates previous tokens for the same email.
 */
@Entity
@Table(name = "otp_tokens", indexes = {
    @Index(name = "idx_otp_email", columnList = "email"),
    @Index(name = "idx_otp_token", columnList = "token")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * The email address this OTP was sent to
     */
    @Column(nullable = false, length = 150)
    private String email;
    /**
     * 6-digit numeric OTP code
     */
    @Column(nullable = false, length = 10)
    private String token;
    /**
     * When this OTP was generated
     */
    @Column(nullable = false)
    private LocalDateTime createdAt;
    /**
     * When this OTP expires
     */
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    /**
     * Whether this OTP has already been successfully used
     */
    @Builder.Default
    private Boolean used = false;
    /**
     * Purpose of this OTP
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private OtpPurpose purpose = OtpPurpose.SIGNUP;
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
    public boolean isValid() {
        return !used && !isExpired();
    }
    public enum OtpPurpose {
        SIGNUP,
        FORGOT_PASSWORD,
        LOGIN_OTP
    }
}
