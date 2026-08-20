package com.ems.dto;

import com.ems.entity.AppSettings;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AppSettingsResponse {

    private String companyName;
    private String companyEmail;
    private String companyPhone;
    private String companyAddress;
    private boolean emailNotifications;
    private boolean leaveNotifications;
    private boolean announcementNotifications;

    public static AppSettingsResponse from(AppSettings settings) {
        return AppSettingsResponse.builder()
                .companyName(settings.getCompanyName())
                .companyEmail(settings.getCompanyEmail())
                .companyPhone(settings.getCompanyPhone())
                .companyAddress(settings.getCompanyAddress())
                .emailNotifications(settings.isEmailNotifications())
                .leaveNotifications(settings.isLeaveNotifications())
                .announcementNotifications(settings.isAnnouncementNotifications())
                .build();
    }
}
