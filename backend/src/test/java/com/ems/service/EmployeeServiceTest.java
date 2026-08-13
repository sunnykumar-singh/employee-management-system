package com.ems.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ems.dto.EmployeeRequest;
import com.ems.dto.EmployeeResponse;
import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.entity.EmployeeStatus;
import com.ems.entity.Gender;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Department department;
    private EmployeeRequest request;
    private Employee employee;

    @BeforeEach
    void setUp() {
        department = Department.builder().id(1L).departmentId("DEP001").name("Engineering").active(true).build();

        request = new EmployeeRequest();
        request.setEmployeeId("emp009");
        request.setFullName("Alex Rivera");
        request.setEmail("alex.rivera@company.com");
        request.setPhone("9876543210");
        request.setDepartmentId(1L);
        request.setDesignation("Senior Developer");
        request.setJoiningDate(LocalDate.of(2024, 1, 15));
        request.setStatus(EmployeeStatus.ACTIVE);
        request.setGender(Gender.MALE);

        employee = Employee.builder()
                .id(9L)
                .employeeId("EMP009")
                .fullName("Alex Rivera")
                .email("alex.rivera@company.com")
                .phone("9876543210")
                .department(department)
                .designation("Senior Developer")
                .joiningDate(LocalDate.of(2024, 1, 15))
                .status(EmployeeStatus.ACTIVE)
                .gender(Gender.MALE)
                .active(true)
                .build();
    }

    @Test
    void createPersistsActiveEmployee() {
        when(employeeRepository.existsByEmployeeIdIgnoreCase("EMP009")).thenReturn(false);
        when(employeeRepository.existsByEmailIgnoreCase("alex.rivera@company.com")).thenReturn(false);
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));
        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);

        EmployeeResponse response = employeeService.create(request);

        assertThat(response.getEmployeeId()).isEqualTo("EMP009");
        assertThat(response.getDepartment().getName()).isEqualTo("Engineering");
        assertThat(response.isActive()).isTrue();

        ArgumentCaptor<Employee> captor = ArgumentCaptor.forClass(Employee.class);
        verify(employeeRepository).save(captor.capture());
        assertThat(captor.getValue().isActive()).isTrue();
        assertThat(captor.getValue().getEmployeeId()).isEqualTo("EMP009");
    }

    @Test
    void createRejectsDuplicateEmail() {
        when(employeeRepository.existsByEmployeeIdIgnoreCase("EMP009")).thenReturn(false);
        when(employeeRepository.existsByEmailIgnoreCase("alex.rivera@company.com")).thenReturn(true);

        assertThatThrownBy(() -> employeeService.create(request))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Email already exists");
    }

    @Test
    void createRejectsMissingDepartment() {
        when(employeeRepository.existsByEmployeeIdIgnoreCase("EMP009")).thenReturn(false);
        when(employeeRepository.existsByEmailIgnoreCase("alex.rivera@company.com")).thenReturn(false);
        when(departmentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.create(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Department not found");
    }

    @Test
    void getByIdIgnoresSoftDeletedEmployees() {
        when(employeeRepository.findByIdAndActiveTrue(9L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.getById(9L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Employee not found");
    }

    @Test
    void deleteMarksEmployeeInactive() {
        when(employeeRepository.findByIdAndActiveTrue(9L)).thenReturn(Optional.of(employee));
        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);

        employeeService.delete(9L);

        ArgumentCaptor<Employee> captor = ArgumentCaptor.forClass(Employee.class);
        verify(employeeRepository).save(captor.capture());
        assertThat(captor.getValue().isActive()).isFalse();
    }
}
