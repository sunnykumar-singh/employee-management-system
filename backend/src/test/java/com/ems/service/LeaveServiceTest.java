package com.ems.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.ArgumentMatchers.nullable;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ems.dto.LeaveDecisionRequest;
import com.ems.dto.LeaveRequest;
import com.ems.dto.LeaveResponse;
import com.ems.entity.Department;
import com.ems.entity.DepartmentStatus;
import com.ems.entity.Employee;
import com.ems.entity.Leave;
import com.ems.entity.LeaveStatus;
import com.ems.entity.LeaveType;
import com.ems.exception.BadRequestException;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LeaveServiceTest {

    @Mock
    private LeaveRepository leaveRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private LeaveService leaveService;

    private Employee employee;
    private LeaveRequest request;
    private Leave leave;

    @BeforeEach
    void setUp() {
        Department department = Department.builder()
                .id(1L)
                .departmentId("DEP001")
                .name("Engineering")
                .status(DepartmentStatus.ACTIVE)
                .build();

        employee = Employee.builder()
                .id(1L)
                .employeeId("EMP001")
                .fullName("Rahul Sharma")
                .designation("Senior Developer")
                .department(department)
                .active(true)
                .casualLeaveBalance(7)
                .sickLeaveBalance(12)
                .annualLeaveBalance(18)
                .emergencyLeaveBalance(3)
                .build();

        request = new LeaveRequest();
        request.setEmployeeId(1L);
        request.setLeaveType(LeaveType.CASUAL);
        request.setFromDate(LocalDate.of(2026, 8, 10));
        request.setToDate(LocalDate.of(2026, 8, 12));
        request.setReason("Family Function");

        leave = Leave.builder()
                .id(20L)
                .employee(employee)
                .leaveType(LeaveType.CASUAL)
                .fromDate(LocalDate.of(2026, 8, 10))
                .toDate(LocalDate.of(2026, 8, 12))
                .days(3)
                .reason("Family Function")
                .status(LeaveStatus.PENDING)
                .appliedOn(LocalDate.of(2026, 8, 5))
                .build();
    }

    @Test
    void createPersistsPendingLeaveAndComputesDays() {
        when(employeeRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(employee));
        when(leaveRepository.existsOverlappingLeave(eq(1L), any(), any(), any(), isNull())).thenReturn(false);
        when(leaveRepository.sumDaysByEmployeeAndTypeAndStatuses(eq(1L), eq(LeaveType.CASUAL), any(), isNull()))
                .thenReturn(0);
        when(leaveRepository.save(any(Leave.class))).thenAnswer(invocation -> {
            Leave saved = invocation.getArgument(0);
            saved.setId(20L);
            return saved;
        });

        LeaveResponse response = leaveService.create(request);

        assertThat(response.getDays()).isEqualTo(3);
        assertThat(response.getStatus()).isEqualTo(LeaveStatus.PENDING);
        assertThat(response.getEmployee().getEmployeeId()).isEqualTo("EMP001");

        ArgumentCaptor<Leave> captor = ArgumentCaptor.forClass(Leave.class);
        verify(leaveRepository).save(captor.capture());
        assertThat(captor.getValue().getDays()).isEqualTo(3);
        assertThat(captor.getValue().getStatus()).isEqualTo(LeaveStatus.PENDING);
    }

    @Test
    void createRejectsOverlappingLeave() {
        when(employeeRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(employee));
        when(leaveRepository.existsOverlappingLeave(eq(1L), any(), any(), any(), isNull())).thenReturn(true);

        assertThatThrownBy(() -> leaveService.create(request))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Leave dates overlap with an existing pending or approved request");
    }

    @Test
    void createRejectsInsufficientBalance() {
        when(employeeRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(employee));
        when(leaveRepository.existsOverlappingLeave(eq(1L), any(), any(), any(), isNull())).thenReturn(false);
        when(leaveRepository.sumDaysByEmployeeAndTypeAndStatuses(eq(1L), eq(LeaveType.CASUAL), any(), isNull()))
                .thenReturn(6);

        assertThatThrownBy(() -> leaveService.create(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Insufficient casual leave balance");
    }

    @Test
    void approvePendingLeave() {
        when(leaveRepository.findById(20L)).thenReturn(Optional.of(leave));
        when(leaveRepository.existsOverlappingLeave(eq(1L), any(), any(), any(), eq(20L))).thenReturn(false);
        when(leaveRepository.sumDaysByEmployeeAndTypeAndStatuses(
                        eq(1L), eq(LeaveType.CASUAL), any(), nullable(Long.class)))
                .thenReturn(0);
        when(leaveRepository.save(any(Leave.class))).thenReturn(leave);

        LeaveResponse response = leaveService.approve(20L, null);

        assertThat(response.getStatus()).isEqualTo(LeaveStatus.APPROVED);
        verify(leaveRepository).save(leave);
    }

    @Test
    void rejectPendingLeaveStoresRemarks() {
        LeaveDecisionRequest decision = new LeaveDecisionRequest();
        decision.setRemarks("Insufficient documentation");
        when(leaveRepository.findById(20L)).thenReturn(Optional.of(leave));
        when(leaveRepository.sumDaysByEmployeeAndTypeAndStatuses(
                        eq(1L), eq(LeaveType.CASUAL), any(), nullable(Long.class)))
                .thenReturn(0);
        when(leaveRepository.save(any(Leave.class))).thenReturn(leave);

        LeaveResponse response = leaveService.reject(20L, decision);

        assertThat(response.getStatus()).isEqualTo(LeaveStatus.REJECTED);
        assertThat(leave.getRemarks()).isEqualTo("Insufficient documentation");
    }

    @Test
    void approveRejectsNonPendingLeave() {
        leave.setStatus(LeaveStatus.APPROVED);
        when(leaveRepository.findById(20L)).thenReturn(Optional.of(leave));

        assertThatThrownBy(() -> leaveService.approve(20L, null))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Only pending leave requests can be approved");
    }

    @Test
    void createRejectsMissingEmployee() {
        when(employeeRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> leaveService.create(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Employee not found");
    }

    @Test
    void deleteRemovesLeave() {
        when(leaveRepository.findById(20L)).thenReturn(Optional.of(leave));

        leaveService.delete(20L);

        verify(leaveRepository).delete(leave);
    }

    @Test
    void deleteRejectsMissingLeave() {
        when(leaveRepository.findById(20L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> leaveService.delete(20L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Leave request not found");

        verify(leaveRepository, never()).delete(any(Leave.class));
    }
}
