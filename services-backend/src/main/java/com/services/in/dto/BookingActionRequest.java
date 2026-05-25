package com.services.in.dto;

import lombok.Data;

@Data
public class BookingActionRequest {
    private String otp;
    private String address;
    private String bookingDate;
    private String timeSlot;
    private String paymentMethod;
    private Integer rating;
    private String review;
}
