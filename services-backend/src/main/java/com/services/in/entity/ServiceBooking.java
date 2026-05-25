package com.services.in.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "service_bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long providerId;

    @Column(length = 100)
    private String providerName;

    @Column(nullable = false, length = 100)
    private String serviceName;

    @Column(length = 100)
    private String skill;

    @Column(length = 100)
    private String customerName;

    @Column(length = 15)
    private String customerMobile;

    @Column(length = 300)
    private String address;

    @Column(length = 40)
    private String bookingDate;

    @Column(length = 40)
    private String timeSlot;

    private Integer amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private BookingStatus status = BookingStatus.REQUESTED;

    @Column(length = 6)
    private String startOtp;

    @Column(length = 20)
    private String paymentMethod;

    private Integer rating;

    @Column(length = 500)
    private String review;

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

    public enum BookingStatus {
        REQUESTED,
        ACCEPTED,
        REJECTED,
        STARTED,
        COMPLETED,
        PAID,
        RATED
    }
}
