package com.ems.service;

import com.ems.dto.AnnouncementResponse;
import com.ems.dto.AttendanceResponse;
import com.ems.dto.EmployeeDashboardResponse;
import com.ems.dto.LeaveRequest;
import com.ems.dto.LeaveResponse;
import com.ems.dto.PageResponse;
import com.ems.entity.AnnouncementStatus;
import com.ems.entity.Attendance;
import com.ems.entity.AttendanceStatus;
import com.ems.entity.Employee;
import com.ems.entity.Leave;
import com.ems.entity.LeaveStatus;
import com.ems.entity.LeaveType;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.AttendanceSpecifications;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveRepository;
import com.ems.repository.LeaveSpecifications;
import java.time.LocalDate;
import java.util.EnumSet;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmployeePortalService {

    private static final EnumSet<LeaveStatus> ACTIVE_LEAVE_STATUSES = EnumSet.of(LeaveStatus.PENDING, LeaveStatus.APPROVED);

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final LeaveService leaveService;
    private final AttendanceService attendanceService;
    private final AnnouncementService announcementService;

    @Transactional(readOnly = true)
    public EmployeeDashboardResponse dashboard(String email) {
        Employee employee = requireEmployee(email);
        Page<AttendanceResponse> recentAttendance = attendanceRepository.findAll(
                        ownAttendance(employee).and(AttendanceSpecifications.hasDate(null)),
                        PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "date")))
                .map(AttendanceResponse::from);

        return EmployeeDashboardResponse.builder()
                .presentDays(attendanceRepository.countByEmployeeIdAndStatus(employee.getId(), AttendanceStatus.PRESENT))
                .absentDays(attendanceRepository.countByEmployeeIdAndStatus(employee.getId(), AttendanceStatus.ABSENT))
                .pendingLeaves(leaveRepository.countByEmployeeIdAndStatus(employee.getId(), LeaveStatus.PENDING))
                .leaveBalance(remainingLeaveBalance(employee))
                .recentAnnouncements(announcementService.list(
                                null,
                                AnnouncementStatus.PUBLISHED,
                                employee.getDepartment().getId(),
                                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "publishedAt")))
                        .getContent())
                .recentAttendance(recentAttendance.getContent())
                .upcomingLeave(leaveRepository
                        .findFirstByEmployeeIdAndStatusAndFromDateGreaterThanEqualOrderByFromDateAsc(
                                employee.getId(), LeaveStatus.APPROVED, LocalDate.now())
                        .map(leave -> LeaveResponse.from(leave, null))
                        .orElse(null))
                .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<AttendanceResponse> attendance(String email, LocalDate date, AttendanceStatus status, Pageable pageable) {
        Employee employee = requireEmployee(email);
        Page<AttendanceResponse> page = attendanceRepository.findAll(
                        ownAttendance(employee)
                                .and(AttendanceSpecifications.hasDate(date))
                                .and(AttendanceSpecifications.hasStatus(status)),
                        pageable)
                .map(AttendanceResponse::from);
        return PageResponse.from(page);
    }

    @Transactional
    public AttendanceResponse checkIn(String email) {
        return attendanceService.checkIn(requireEmployee(email));
    }

    @Transactional
    public AttendanceResponse checkOut(String email) {
        return attendanceService.checkOut(requireEmployee(email));
    }

    @Transactional(readOnly = true)
    public PageResponse<LeaveResponse> leaves(String email, LeaveStatus status, Pageable pageable) {
        Employee employee = requireEmployee(email);
        Page<LeaveResponse> page = leaveRepository.findAll(
                        ownLeave(employee).and(LeaveSpecifications.hasStatus(status)), pageable)
                .map(leave -> LeaveResponse.from(leave, null));
        return PageResponse.from(page);
    }

    @Transactional
    public LeaveResponse applyLeave(String email, LeaveRequest request) {
        return leaveService.createForEmployee(requireEmployee(email), request);
    }

    @Transactional
    public void cancelLeave(String email, Long leaveId) {
        leaveService.cancelForEmployee(leaveId, requireEmployee(email).getId());
    }

    @Transactional(readOnly = true)
    public PageResponse<AnnouncementResponse> announcements(String email, String search, Pageable pageable) {
        Employee employee = requireEmployee(email);
        return announcementService.list(search, AnnouncementStatus.PUBLISHED, employee.getDepartment().getId(), pageable);
    }

    private Employee requireEmployee(String email) {
        return employeeRepository.findByEmailIgnoreCaseAndActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("No active employee record is linked to this account"));
    }

    private Specification<Attendance> ownAttendance(Employee employee) {
        return (root, query, builder) -> builder.equal(root.get("employee").get("id"), employee.getId());
    }

    private Specification<Leave> ownLeave(Employee employee) {
        return (root, query, builder) -> builder.equal(root.get("employee").get("id"), employee.getId());
    }

    private int remainingLeaveBalance(Employee employee) {
        return java.util.Arrays.stream(LeaveType.values())
                .mapToInt(type -> employee.getLeaveEntitlement(type) - leaveRepository.sumDaysByEmployeeAndTypeAndStatuses(
                        employee.getId(), type, ACTIVE_LEAVE_STATUSES, null))
                .map(value -> Math.max(value, 0))
                .sum();
    }
}
