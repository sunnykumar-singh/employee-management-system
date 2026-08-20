package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.dto.AppSettingsRequest;
import com.ems.dto.AppSettingsResponse;
import com.ems.service.AppSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AppSettingsController {

    private final AppSettingsService appSettingsService;

    @GetMapping
    public ResponseEntity<ApiResponse<AppSettingsResponse>> get() {
        return ResponseEntity.ok(ApiResponse.success("Settings fetched successfully", appSettingsService.get()));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<AppSettingsResponse>> update(@Valid @RequestBody AppSettingsRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Settings updated successfully", appSettingsService.update(request)));
    }
}
