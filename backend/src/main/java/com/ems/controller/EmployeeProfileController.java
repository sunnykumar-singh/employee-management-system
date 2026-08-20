package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.dto.ChangePasswordRequest;
import com.ems.dto.LoginResponse;
import com.ems.dto.ProfileUpdateRequest;
import com.ems.dto.UserResponse;
import com.ems.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeProfileController {

    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserResponse>> get(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", authService.getCurrentUser(authentication)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<LoginResponse>> update(
            Authentication authentication, @Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", authService.updateProfile(authentication, request)));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(authentication, request);
        return ResponseEntity.ok(ApiResponse.success("Password updated successfully", null));
    }
}
