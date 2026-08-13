package com.ems.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ems.dto.AttendanceRequest;
import com.ems.dto.AttendanceResponse;
import com.ems.entity.Attendance;
import com.ems.entity.AttendanceStatus;
import com.ems.entity.Department;
import com.ems.entity.DepartmentStatus;
import com.ems.entity.Employee;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.EmployeeRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private AttendanceService attendanceService;

    private Employee employee;
    private AttendanceRequest request;
    private Attendance attendance;

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
                .fullName("John Doe")
                .designation("Senior Developer")
                .department(department)
                .active(true)
                .build();

        request = new AttendanceRequest();
        request.setEmployeeId(1L);
        request.setDate(LocalDate.of(2026, 5, 24));
        request.setCheckIn(LocalTime.of(9, 5));
        request.setCheckOut(LocalTime.of(18, 10));
        request.setStatus(AttendanceStatus.PRESENT);

        attendance = Attendance.builder()
                .id(10L)
                .employee(employee)
                .date(LocalDate.of(2026, 5, 24))
                .checkIn(LocalTime.of(9, 5))
                .checkOut(LocalTime.of(18, 10))
                .status(AttendanceStatus.PRESENT)
                .workingHours("9h 05m")
                .build();
    }

    @Test
    void createPersistsAttendanceAndComputesWorkingHours() {
        when(employeeRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(employee));
        when(attendanceRepository.existsByEmployeeIdAndDate(1L, LocalDate.of(2026, 5, 24))).thenReturn(false);
        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(invocation -> {
            Attendance saved = invocation.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        AttendanceResponse response = attendanceService.create(request);

        assertThat(response.getEmployee().getEmployeeId()).isEqualTo("EMP001");
        assertThat(response.getWorkingHours()).isEqualTo("9h 05m");
        assertThat(response.getStatus()).isEqualTo(AttendanceStatus.PRESENT);

        ArgumentCaptor<Attendance> captor = ArgumentCaptor.forClass(Attendance.class);
        verify(attendanceRepository).save(captor.capture());
        assertThat(captor.getValue().getWorkingHours()).isEqualTo("9h 05m");
    }

    @Test
    void createRejectsDuplicateEmployeeAndDate() {
        when(employeeRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(employee));
        when(attendanceRepository.existsByEmployeeIdAndDate(1L, LocalDate.of(2026, 5, 24))).thenReturn(true);

        assertThatThrownBy(() -> attendanceService.create(request))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Attendance already exists for this employee on the selected date");
    }

    @Test
    void createRejectsMissingEmployee() {
        when(employeeRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> attendanceService.create(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Employee not found");
    }

    @Test
    void createClearsTimesWhenAbsent() {
        request.setStatus(AttendanceStatus.ABSENT);
        when(employeeRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(employee));
        when(attendanceRepository.existsByEmployeeIdAndDate(1L, LocalDate.of(2026, 5, 24))).thenReturn(false);
        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(invocation -> invocation.getArgument(0));

        attendanceService.create(request);

        ArgumentCaptor<Attendance> captor = ArgumentCaptor.forClass(Attendance.class);
        verify(attendanceRepository).save(captor.capture());
        assertThat(captor.getValue().getCheckIn()).isNull();
        assertThat(captor.getValue().getCheckOut()).isNull();
        assertThat(captor.getValue().getWorkingHours()).isEqualTo("0h 00m");
    }

    @Test
    void deleteRemovesAttendance() {
        when(attendanceRepository.findById(10L)).thenReturn(Optional.of(attendance));

        attendanceService.delete(10L);

        verify(attendanceRepository).delete(attendance);
    }

    @Test
    void deleteRejectsMissingAttendance() {
        when(attendanceRepository.findById(10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> attendanceService.delete(10L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Attendance record not found");

        verify(attendanceRepository, never()).delete(any(Attendance.class));
    }
}
