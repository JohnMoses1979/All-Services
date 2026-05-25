package com.services.in.dto;

import com.services.in.entity.OwnerAccount;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerDto {

    private Long id;
    private String fullName;
    private String mobile;
    private String societyName;
    private String flatNo;
    private String address;
    private String profileImageUri;
    private String language;
    private String theme;
    private OwnerNotificationSettingsDto notificationSettings;
    private Boolean mobileVerified;

    public static OwnerDto from(OwnerAccount owner) {
        return OwnerDto.builder()
                .id(owner.getId())
                .fullName(owner.getFullName())
                .mobile(owner.getMobile())
                .societyName(owner.getSocietyName())
                .flatNo(owner.getFlatNo())
                .address(owner.getAddress())
                .profileImageUri(owner.getProfileImageUri())
                .language(owner.getLanguage())
                .theme(owner.getTheme())
                .notificationSettings(OwnerNotificationSettingsDto.from(owner))
                .mobileVerified(owner.getMobileVerified())
                .build();
    }
}
