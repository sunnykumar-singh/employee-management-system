package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.dto.LeaveDecisionRequest;
import com.ems.dto.LeaveRequest;
import com.ems.dto.LeaveResponse;
import com.ems.dto.PageResponse;
import com.ems.entity.LeaveStatus;
import com.ems.entity.LeaveType;
import com.ems.service.LeaveService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveResponse>> create(@Valid @RequestBody LeaveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Leave request created successfully", leaveService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<LeaveResponse>>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LeaveType leaveType,
            @RequestParam(required = false) LeaveStatus status,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PageableDefault(size = 10, sort = "appliedOn", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Leave requests fetched successfully",
                leaveService.list(search, leaveType, status, departmentId, date, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeaveResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Leave request fetched successfully", leaveService.getById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveResponse>> update(
            @PathVariable Long id, @Valid @RequestBody LeaveRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Leave request updated successfully", leaveService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        leaveService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Leave request deleted successfully", null));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveResponse>> approve(
            @PathVariable Long id, @Valid @RequestBody(required = false) LeaveDecisionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Leave request approved successfully", leaveService.approve(id, request)));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveResponse>> reject(
            @PathVariable Long id, @Valid @RequestBody(required = false) LeaveDecisionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Leave request rejected successfully", leaveService.reject(id, request)));
    }
}
