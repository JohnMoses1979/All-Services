package com.services.in.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    private String fullName;
    private String area;
    private String city;
    private String state;
    private String pinCode;
    private String dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String bio;
    private String aadhaarNumber;
    private String emergencyContact;
    private String emergencyName;
    private Integer experienceYears;
    private List<String> skills;
    private Boolean available;
}
