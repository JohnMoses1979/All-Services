package com.services.in.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Sends transactional emails using Spring Boot's JavaMailSender (configured
 * via spring.mail.* properties in application.properties).
 *
 * The sendOtp method is @Async so the HTTP response is not blocked while
 * the SMTP round-trip completes.
 */
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.mail.from-name}")
    private String fromName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends a 6-digit OTP to the provider's email for signup verification.
     *
     * @param toEmail   recipient email address
     * @param otp       6-digit OTP string
     * @param purpose   human-readable purpose, e.g. "account verification"
     * @param expiryMin how many minutes until the OTP expires
     */
    @Async
    public void sendOtpEmail(String toEmail, String otp, String purpose, int expiryMin) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, fromName);
            helper.setTo(toEmail);
            helper.setSubject("Your ServeNow OTP: " + otp);
            helper.setText(buildOtpEmailHtml(otp, purpose, expiryMin), true);

            mailSender.send(message);

        } catch (MessagingException | java.io.UnsupportedEncodingException ex) {
            // Log and re-throw as unchecked so the transaction isn't rolled back silently
            throw new RuntimeException("Failed to send OTP email to " + toEmail, ex);
        }
    }

    /**
     * Sends a welcome email once the provider completes registration (skills selected).
     *
     * @param toEmail  recipient email
     * @param fullName provider full name
     */
    @Async
    public void sendWelcomeEmail(String toEmail, String fullName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, fromName);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to ServeNow, " + fullName + "!");
            helper.setText(buildWelcomeEmailHtml(fullName), true);

            mailSender.send(message);

        } catch (MessagingException | java.io.UnsupportedEncodingException ex) {
            throw new RuntimeException("Failed to send welcome email to " + toEmail, ex);
        }
    }

    // ── HTML templates ────────────────────────────────────────

    private String buildOtpEmailHtml(String otp, String purpose, int expiryMin) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8"/>
                  <style>
                    body { font-family: 'Segoe UI', sans-serif; background:#f4f4f4; margin:0; padding:0; }
                    .container { max-width:520px; margin:40px auto; background:#fff;
                                 border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.08); }
                    .header { background:#1a1a2e; padding:28px 32px; }
                    .logo { color:#fff; font-size:22px; font-weight:900; letter-spacing:1px; }
                    .body { padding:32px; }
                    .otp-box { background:#f0f4ff; border-radius:10px; padding:22px;
                               text-align:center; margin:24px 0; }
                    .otp { font-size:42px; font-weight:900; color:#1a1a2e; letter-spacing:10px; }
                    .footer { background:#f8f8f8; padding:18px 32px; font-size:12px; color:#999; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header"><span class="logo">ServeNow</span></div>
                    <div class="body">
                      <h2 style="color:#1a1a2e;margin-top:0;">Your verification code</h2>
                      <p style="color:#555;">Use the code below for <strong>%s</strong>.
                         It expires in <strong>%d minutes</strong>.</p>
                      <div class="otp-box">
                        <div class="otp">%s</div>
                      </div>
                      <p style="color:#777;font-size:13px;">
                        If you did not request this code, please ignore this email.
                        Never share your OTP with anyone.
                      </p>
                    </div>
                    <div class="footer">
                      &copy; 2026 ServeNow &bull; All rights reserved
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(purpose, expiryMin, otp);
    }

    private String buildWelcomeEmailHtml(String fullName) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8"/>
                  <style>
                    body { font-family: 'Segoe UI', sans-serif; background:#f4f4f4; margin:0; padding:0; }
                    .container { max-width:520px; margin:40px auto; background:#fff;
                                 border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.08); }
                    .header { background:#1a1a2e; padding:28px 32px; }
                    .logo { color:#fff; font-size:22px; font-weight:900; }
                    .body { padding:32px; }
                    .cta { display:inline-block; background:#1a1a2e; color:#fff;
                           padding:14px 28px; border-radius:10px; text-decoration:none;
                           font-weight:700; margin-top:18px; }
                    .footer { background:#f8f8f8; padding:18px 32px; font-size:12px; color:#999; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header"><span class="logo">ServeNow</span></div>
                    <div class="body">
                      <h2 style="color:#1a1a2e;margin-top:0;">Welcome, %s! 🎉</h2>
                      <p style="color:#555;">Your provider account is now active.
                         You can start accepting jobs and earning through ServeNow.</p>
                      <p style="color:#555;">Open the app and complete your profile to
                         get discovered by customers in your area.</p>
                    </div>
                    <div class="footer">
                      &copy; 2026 ServeNow &bull; All rights reserved
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(fullName);
    }
}
