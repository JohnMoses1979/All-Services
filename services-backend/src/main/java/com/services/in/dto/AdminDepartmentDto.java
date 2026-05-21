package com.services.in.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDepartmentDto {

    private String id;
    private String name;
    private long workers;
    private long pending;
}
