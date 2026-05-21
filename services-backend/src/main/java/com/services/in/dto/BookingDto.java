package com.services.in.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingDto {
    private Long id;
    private Long providerId;
    private String providerName;
    private String serviceName;
    private String skill;
    private String customerName;
    private String customerMobile;
    private String address;
    private String bookingDate;
    private String timeSlot;
    private Integer amount;
    private String status;
    private String startOtp;
    private String paymentMethod;
    private Integer rating;
    private String review;
}
