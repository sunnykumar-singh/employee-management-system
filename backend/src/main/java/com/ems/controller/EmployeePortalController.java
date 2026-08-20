package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.dto.AnnouncementResponse;
import com.ems.dto.AttendanceResponse;
import com.ems.dto.EmployeeDashboardResponse;
import com.ems.dto.EmployeeLeaveRequest;
import com.ems.dto.LeaveRequest;
import com.ems.dto.LeaveResponse;
import com.ems.dto.PageResponse;
import com.ems.entity.AttendanceStatus;
import com.ems.entity.LeaveStatus;
import com.ems.service.EmployeePortalService;
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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeePortalController {

    private final EmployeePortalService employeePortalService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<EmployeeDashboardResponse>> dashboard(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                "Employee dashboard fetched successfully", employeePortalService.dashboard(authentication.getName())));
    }

    @GetMapping("/attendance")
    public ResponseEntity<ApiResponse<PageResponse<AttendanceResponse>>> attendance(
            Authentication authentication,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) AttendanceStatus status,
            @PageableDefault(size = 10, sort = "date", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Attendance records fetched successfully",
                employeePortalService.attendance(authentication.getName(), date, status, pageable)));
    }

    @PostMapping("/attendance/check-in")
    public ResponseEntity<ApiResponse<AttendanceResponse>> checkIn(Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                "Checked in successfully", employeePortalService.checkIn(authentication.getName())));
    }

    @PostMapping("/attendance/check-out")
    public ResponseEntity<ApiResponse<AttendanceResponse>> checkOut(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                "Checked out successfully", employeePortalService.checkOut(authentication.getName())));
    }

    @GetMapping("/leaves")
    public ResponseEntity<ApiResponse<PageResponse<LeaveResponse>>> leaves(
            Authentication authentication,
            @RequestParam(required = false) LeaveStatus status,
            @PageableDefault(size = 10, sort = "appliedOn", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Leave requests fetched successfully", employeePortalService.leaves(authentication.getName(), status, pageable)));
    }

    @PostMapping("/leaves")
    public ResponseEntity<ApiResponse<LeaveResponse>> applyLeave(
            Authentication authentication, @Valid @RequestBody EmployeeLeaveRequest request) {
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setLeaveType(request.getLeaveType());
        leaveRequest.setFromDate(request.getFromDate());
        leaveRequest.setToDate(request.getToDate());
        leaveRequest.setReason(request.getReason());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                "Leave request submitted successfully", employeePortalService.applyLeave(authentication.getName(), leaveRequest)));
    }

    @DeleteMapping("/leaves/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelLeave(Authentication authentication, @PathVariable Long id) {
        employeePortalService.cancelLeave(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Leave request cancelled successfully", null));
    }

    @GetMapping("/announcements")
    public ResponseEntity<ApiResponse<PageResponse<AnnouncementResponse>>> announcements(
            Authentication authentication,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "publishedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Announcements fetched successfully", employeePortalService.announcements(authentication.getName(), search, pageable)));
    }
}
