package com.ems.service;

import com.ems.dto.AppSettingsRequest;
import com.ems.dto.AppSettingsResponse;
import com.ems.entity.AppSettings;
import com.ems.repository.AppSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AppSettingsService {

    private static final long SETTINGS_ID = 1L;

    private final AppSettingsRepository appSettingsRepository;

    @Transactional
    public AppSettingsResponse get() {
        return AppSettingsResponse.from(getOrCreate());
    }

    @Transactional
    public AppSettingsResponse update(AppSettingsRequest request) {
        AppSettings settings = getOrCreate();
        settings.setCompanyName(request.getCompanyName().trim());
        settings.setCompanyEmail(request.getCompanyEmail().trim().toLowerCase());
        settings.setCompanyPhone(request.getCompanyPhone().trim());
        settings.setCompanyAddress(request.getCompanyAddress().trim());
        settings.setEmailNotifications(request.isEmailNotifications());
        settings.setLeaveNotifications(request.isLeaveNotifications());
        settings.setAnnouncementNotifications(request.isAnnouncementNotifications());
        return AppSettingsResponse.from(appSettingsRepository.save(settings));
    }

    private AppSettings getOrCreate() {
        return appSettingsRepository.findById(SETTINGS_ID).orElseGet(() -> appSettingsRepository.save(AppSettings.builder()
                .id(SETTINGS_ID)
                .companyName("Acme Corporation")
                .companyEmail("contact@acmecorp.com")
                .companyPhone("+91 98765 43210")
                .companyAddress("4th Floor, Tech Park One, Indiranagar, Bengaluru, Karnataka 560038")
                .emailNotifications(true)
                .leaveNotifications(true)
                .announcementNotifications(false)
                .build()));
    }
}
