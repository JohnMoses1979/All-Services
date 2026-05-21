package com.services.in.dto;

import lombok.Data;

@Data
public class CreateBookingRequest {
    private Long providerId;
    private String serviceName;
    private String skill;
    private String customerName;
    private String customerMobile;
    private String address;
    private String bookingDate;
    private String timeSlot;
    private Integer amount;
}
