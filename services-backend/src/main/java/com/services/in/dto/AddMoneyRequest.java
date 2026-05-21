package com.services.in.dto;

 
import java.math.BigDecimal;

import lombok.Data;

@Data
public class AddMoneyRequest {
    private String mobileNumber;
    private BigDecimal amount;
}
