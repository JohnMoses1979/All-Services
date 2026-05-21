package com.services.in.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "owner_accounts",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = "mobile")
        })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 15)
    private String mobile;

    @Column(length = 150)
    private String societyName;

    @Column(length = 50)
    private String flatNo;

    @Column(length = 255)
    private String address;

    @Column(length = 500)
    private String profileImageUri;

    @Column(length = 20)
    private String language;

    @Column(length = 20)
    private String theme;

    @Builder.Default
    private Boolean notifyBookingConfirmations = true;

    @Builder.Default
    private Boolean notifyBookingReminders = true;

    @Builder.Default
    private Boolean notifyBookingCancellations = true;

    @Builder.Default
    private Boolean notifyOffersDiscounts = true;

    @Builder.Default
    private Boolean notifyNewServices = false;

    @Builder.Default
    private Boolean notifyWalletUpdates = true;

    @Builder.Default
    private Boolean notifyReferEarnUpdates = true;

    private Boolean mobileVerified;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
