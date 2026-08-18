package com.ems.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ems.dto.DepartmentRequest;
import com.ems.dto.DepartmentResponse;
import com.ems.entity.Department;
import com.ems.entity.DepartmentStatus;
import com.ems.entity.Employee;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveRepository;
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
class DepartmentServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private LeaveRepository leaveRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private DepartmentService departmentService;

    private DepartmentRequest request;
    private Department department;

    @BeforeEach
    void setUp() {
        request = new DepartmentRequest();
        request.setDepartmentId("dep009");
        request.setName("Legal");
        request.setHead("Priya Nair");
        request.setDescription("Handles contracts and compliance");
        request.setStatus(DepartmentStatus.ACTIVE);

        department = Department.builder()
                .id(9L)
                .departmentId("DEP009")
                .name("Legal")
                .head("Priya Nair")
                .description("Handles contracts and compliance")
                .status(DepartmentStatus.ACTIVE)
                .build();
    }

    @Test
    void createPersistsDepartment() {
        when(departmentRepository.existsByDepartmentIdIgnoreCase("DEP009")).thenReturn(false);
        when(departmentRepository.existsByNameIgnoreCase("Legal")).thenReturn(false);
        when(departmentRepository.save(any(Department.class))).thenReturn(department);
        when(employeeRepository.countByDepartmentIdAndActiveTrue(9L)).thenReturn(0L);

        DepartmentResponse response = departmentService.create(request);

        assertThat(response.getDepartmentId()).isEqualTo("DEP009");
        assertThat(response.getName()).isEqualTo("Legal");
        assertThat(response.getStatus()).isEqualTo(DepartmentStatus.ACTIVE);

        ArgumentCaptor<Department> captor = ArgumentCaptor.forClass(Department.class);
        verify(departmentRepository).save(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("Legal");
    }

    @Test
    void createRejectsDuplicateName() {
        when(departmentRepository.existsByDepartmentIdIgnoreCase("DEP009")).thenReturn(false);
        when(departmentRepository.existsByNameIgnoreCase("Legal")).thenReturn(true);

        assertThatThrownBy(() -> departmentService.create(request))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Department name already exists");
    }

    @Test
    void getByIdThrowsWhenMissing() {
        when(departmentRepository.findById(9L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> departmentService.getById(9L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Department not found");
    }

    @Test
    void deleteRemovesUnassignedDepartment() {
        when(departmentRepository.findById(9L)).thenReturn(Optional.of(department));
        when(employeeRepository.existsByDepartmentIdAndActiveTrue(9L)).thenReturn(false);
        when(employeeRepository.findByDepartmentIdAndActiveFalse(9L)).thenReturn(List.of());

        departmentService.delete(9L);

        verify(departmentRepository).delete(department);
    }

    @Test
    void deleteRemovesDepartmentWhenOnlyInactiveEmployeesRemain() {
        Employee inactive = Employee.builder().id(42L).active(false).build();
        when(departmentRepository.findById(9L)).thenReturn(Optional.of(department));
        when(employeeRepository.existsByDepartmentIdAndActiveTrue(9L)).thenReturn(false);
        when(employeeRepository.findByDepartmentIdAndActiveFalse(9L)).thenReturn(List.of(inactive));

        departmentService.delete(9L);

        verify(attendanceRepository).deleteByEmployeeId(42L);
        verify(leaveRepository).deleteByEmployeeId(42L);
        verify(employeeRepository).delete(inactive);
        verify(departmentRepository).delete(department);
    }

    @Test
    void deleteRejectsDepartmentAssignedToEmployees() {
        when(departmentRepository.findById(9L)).thenReturn(Optional.of(department));
        when(employeeRepository.existsByDepartmentIdAndActiveTrue(9L)).thenReturn(true);

        assertThatThrownBy(() -> departmentService.delete(9L))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Cannot delete a department that is assigned to employees");

        verify(departmentRepository, never()).delete(any(Department.class));
        verify(employeeRepository, never()).delete(any(Employee.class));
    }
}
