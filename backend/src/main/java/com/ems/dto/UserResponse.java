package com.ems.dto;

import com.ems.entity.Role;
import com.ems.entity.User;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String profilePhoto;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String address;
    private String emergencyName;
    private String emergencyRelation;
    private String emergencyPhone;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .profilePhoto(user.getProfilePhoto())
                .phone(user.getPhone())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .address(user.getAddress())
                .emergencyName(user.getEmergencyName())
                .emergencyRelation(user.getEmergencyRelation())
                .emergencyPhone(user.getEmergencyPhone())
                .build();
    }
}
