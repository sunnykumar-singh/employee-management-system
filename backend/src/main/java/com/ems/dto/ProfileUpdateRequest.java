package com.ems.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileUpdateRequest {

    @NotBlank(message = "Full name is required.")
    @Size(max = 120, message = "Full name cannot exceed 120 characters.")
    private String fullName;

    @NotBlank(message = "Email is required.")
    @Email(message = "Enter a valid email address.")
    @Size(max = 160, message = "Email cannot exceed 160 characters.")
    private String email;

    @Size(max = 40, message = "Phone number cannot exceed 40 characters.")
    private String phone;

    @Size(max = 30, message = "Gender cannot exceed 30 characters.")
    private String gender;

    private LocalDate dateOfBirth;

    @Size(max = 500, message = "Address cannot exceed 500 characters.")
    private String address;

    @Size(max = 120, message = "Emergency contact name cannot exceed 120 characters.")
    private String emergencyName;

    @Size(max = 80, message = "Emergency contact relationship cannot exceed 80 characters.")
    private String emergencyRelation;

    @Size(max = 40, message = "Emergency contact phone cannot exceed 40 characters.")
    private String emergencyPhone;
}
