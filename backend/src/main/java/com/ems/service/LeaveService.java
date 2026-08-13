package com.ems.service;

import com.ems.dto.LeaveBalanceResponse;
import com.ems.dto.LeaveDecisionRequest;
import com.ems.dto.LeaveRequest;
import com.ems.dto.LeaveResponse;
import com.ems.dto.PageResponse;
import com.ems.entity.Employee;
import com.ems.entity.Leave;
import com.ems.entity.LeaveStatus;
import com.ems.entity.LeaveType;
import com.ems.exception.BadRequestException;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveRepository;
import com.ems.repository.LeaveSpecifications;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.EnumSet;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private static final List<LeaveStatus> ACTIVE_LEAVE_STATUSES = List.copyOf(EnumSet.of(LeaveStatus.PENDING, LeaveStatus.APPROVED));

    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public LeaveResponse create(LeaveRequest request) {
        Employee employee = findActiveEmployee(request.getEmployeeId());
        int days = calculateDays(request.getFromDate(), request.getToDate());
        validateNoOverlap(employee.getId(), request.getFromDate(), request.getToDate(), null);
        validateLeaveBalance(employee, request.getLeaveType(), days, null);

        Leave leave = Leave.builder()
                .employee(employee)
                .leaveType(request.getLeaveType())
                .fromDate(request.getFromDate())
                .toDate(request.getToDate())
                .days(days)
                .reason(request.getReason().trim())
                .status(LeaveStatus.PENDING)
                .appliedOn(LocalDate.now())
                .build();

        return toResponse(leaveRepository.save(leave));
    }

    @Transactional(readOnly = true)
    public PageResponse<LeaveResponse> list(
            String search, LeaveType leaveType, LeaveStatus status, Long departmentId, LocalDate date, Pageable pageable) {
        Specification<Leave> specification = Specification.<Leave>unrestricted()
                .and(LeaveSpecifications.search(search))
                .and(LeaveSpecifications.hasLeaveType(leaveType))
                .and(LeaveSpecifications.hasStatus(status))
                .and(LeaveSpecifications.hasDepartment(departmentId))
                .and(LeaveSpecifications.coversDate(date));

        Page<LeaveResponse> page = leaveRepository.findAll(specification, pageable).map(this::toResponse);
        return PageResponse.from(page);
    }

    @Transactional(readOnly = true)
    public LeaveResponse getById(Long id) {
        return toResponse(findLeave(id));
    }

    @Transactional
    public LeaveResponse update(Long id, LeaveRequest request) {
        Leave leave = findLeave(id);
        ensurePending(leave, "Only pending leave requests can be updated");

        Employee employee = findActiveEmployee(request.getEmployeeId());
        int days = calculateDays(request.getFromDate(), request.getToDate());
        validateNoOverlap(employee.getId(), request.getFromDate(), request.getToDate(), id);
        validateLeaveBalance(employee, request.getLeaveType(), days, id);

        leave.setEmployee(employee);
        leave.setLeaveType(request.getLeaveType());
        leave.setFromDate(request.getFromDate());
        leave.setToDate(request.getToDate());
        leave.setDays(days);
        leave.setReason(request.getReason().trim());

        return toResponse(leaveRepository.save(leave));
    }

    @Transactional
    public void delete(Long id) {
        Leave leave = findLeave(id);
        leaveRepository.delete(leave);
    }

    @Transactional
    public LeaveResponse approve(Long id, LeaveDecisionRequest request) {
        Leave leave = findLeave(id);
        ensurePending(leave, "Only pending leave requests can be approved");
        validateNoOverlap(leave.getEmployee().getId(), leave.getFromDate(), leave.getToDate(), id);
        validateLeaveBalance(leave.getEmployee(), leave.getLeaveType(), leave.getDays(), id);

        leave.setStatus(LeaveStatus.APPROVED);
        leave.setRemarks(normalizeRemarks(request));
        return toResponse(leaveRepository.save(leave));
    }

    @Transactional
    public LeaveResponse reject(Long id, LeaveDecisionRequest request) {
        Leave leave = findLeave(id);
        ensurePending(leave, "Only pending leave requests can be rejected");

        leave.setStatus(LeaveStatus.REJECTED);
        leave.setRemarks(normalizeRemarks(request));
        return toResponse(leaveRepository.save(leave));
    }

    private void validateNoOverlap(Long employeeId, LocalDate fromDate, LocalDate toDate, Long excludeId) {
        if (leaveRepository.existsOverlappingLeave(employeeId, fromDate, toDate, ACTIVE_LEAVE_STATUSES, excludeId)) {
            throw new ConflictException("Leave dates overlap with an existing pending or approved request");
        }
    }

    private void validateLeaveBalance(Employee employee, LeaveType leaveType, int requestedDays, Long excludeId) {
        int entitled = employee.getLeaveEntitlement(leaveType);
        int used = leaveRepository.sumDaysByEmployeeAndTypeAndStatuses(
                employee.getId(), leaveType, ACTIVE_LEAVE_STATUSES, excludeId);
        int remaining = entitled - used;
        if (requestedDays > remaining) {
            throw new BadRequestException(
                    "Insufficient " + leaveType.name().toLowerCase() + " leave balance. Remaining: " + Math.max(remaining, 0)
                            + " day(s)");
        }
    }

    private LeaveBalanceResponse buildBalance(Employee employee, LeaveType leaveType, Long excludeId) {
        int entitled = employee.getLeaveEntitlement(leaveType);
        int used = leaveRepository.sumDaysByEmployeeAndTypeAndStatuses(
                employee.getId(), leaveType, ACTIVE_LEAVE_STATUSES, excludeId);
        return LeaveBalanceResponse.builder()
                .leaveType(leaveType)
                .entitled(entitled)
                .used(used)
                .remaining(Math.max(entitled - used, 0))
                .build();
    }

    private LeaveResponse toResponse(Leave leave) {
        return LeaveResponse.from(leave, buildBalance(leave.getEmployee(), leave.getLeaveType(), null));
    }

    private int calculateDays(LocalDate fromDate, LocalDate toDate) {
        return (int) ChronoUnit.DAYS.between(fromDate, toDate) + 1;
    }

    private void ensurePending(Leave leave, String message) {
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException(message);
        }
    }

    private String normalizeRemarks(LeaveDecisionRequest request) {
        if (request == null || request.getRemarks() == null || request.getRemarks().isBlank()) {
            return null;
        }
        return request.getRemarks().trim();
    }

    private Leave findLeave(Long id) {
        return leaveRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));
    }

    private Employee findActiveEmployee(Long employeeId) {
        return employeeRepository
                .findByIdAndActiveTrue(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
    }
}
