package com.ems.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppSettingsRequest {

    @NotBlank(message = "Company name is required.")
    @Size(max = 160, message = "Company name cannot exceed 160 characters.")
    private String companyName;

    @NotBlank(message = "Company email is required.")
    @Email(message = "Enter a valid company email address.")
    @Size(max = 160, message = "Company email cannot exceed 160 characters.")
    private String companyEmail;

    @NotBlank(message = "Company phone is required.")
    @Size(max = 40, message = "Company phone cannot exceed 40 characters.")
    private String companyPhone;

    @NotBlank(message = "Company address is required.")
    @Size(max = 500, message = "Company address cannot exceed 500 characters.")
    private String companyAddress;

    private boolean emailNotifications;
    private boolean leaveNotifications;
    private boolean announcementNotifications;
}
