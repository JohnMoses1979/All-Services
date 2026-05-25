package com.services.in.entity;

 
import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mobileNumber;

    private String title;

    private BigDecimal amount;

    private String type; // CREDIT or DEBIT

    private String status; // SUCCESS, PENDING, FAILED

    private String paymentProvider; // RAZORPAY, PHONEPE, WALLET

    private String providerOrderId;

    private String providerPaymentId;

    private String receiverMobileNumber;

    private LocalDateTime createdAt;
}
