package com.services.in.dto;

 
import java.math.BigDecimal;

import lombok.Data;

@Data
public class SendMoneyRequest {
    private String senderMobileNumber;
    private String receiverMobileNumber;
    private BigDecimal amount;
}
