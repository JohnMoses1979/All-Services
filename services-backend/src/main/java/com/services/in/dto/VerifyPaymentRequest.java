package com.services.in.dto;

 
import lombok.Data;

@Data
public class VerifyPaymentRequest {
    private String mobileNumber;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
