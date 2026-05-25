package com.services.in.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerNotificationEventDto {

    private String type;
    private String title;
    private String message;
    private Long bookingId;
    private LocalDateTime createdAt;
}
