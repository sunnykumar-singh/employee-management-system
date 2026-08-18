package com.ems.service;

import com.ems.dto.EmployeeRequest;
import com.ems.dto.EmployeeResponse;
import com.ems.dto.PageResponse;
import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.entity.EmployeeStatus;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.EmployeeSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public EmployeeResponse create(EmployeeRequest request) {
        String employeeId = normalizeEmployeeId(request.getEmployeeId());
        String email = normalizeEmail(request.getEmail());

        if (employeeRepository.existsByEmployeeIdIgnoreCase(employeeId)) {
            throw new ConflictException("Employee ID already exists");
        }
        if (employeeRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Email already exists");
        }

        Employee employee = Employee.builder()
                .employeeId(employeeId)
                .fullName(request.getFullName().trim())
                .email(email)
                .phone(request.getPhone().trim())
                .department(findDepartment(request.getDepartmentId()))
                .designation(request.getDesignation().trim())
                .joiningDate(request.getJoiningDate())
                .status(request.getStatus())
                .gender(request.getGender())
                .active(true)
                .build();

        return EmployeeResponse.from(employeeRepository.save(employee));
    }

    @Transactional(readOnly = true)
    public PageResponse<EmployeeResponse> list(String search, Long departmentId, EmployeeStatus status, Pageable pageable) {
        Specification<Employee> specification = EmployeeSpecifications.isActive()
                .and(EmployeeSpecifications.search(search))
                .and(EmployeeSpecifications.hasDepartment(departmentId))
                .and(EmployeeSpecifications.hasStatus(status));

        Page<EmployeeResponse> page = employeeRepository.findAll(specification, pageable).map(EmployeeResponse::from);
        return PageResponse.from(page);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getById(Long id) {
        return EmployeeResponse.from(findActiveEmployee(id));
    }

    @Transactional
    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee employee = findActiveEmployee(id);
        String employeeId = normalizeEmployeeId(request.getEmployeeId());
        String email = normalizeEmail(request.getEmail());

        if (employeeRepository.existsByEmployeeIdIgnoreCaseAndIdNot(employeeId, id)) {
            throw new ConflictException("Employee ID already exists");
        }
        if (employeeRepository.existsByEmailIgnoreCaseAndIdNot(email, id)) {
            throw new ConflictException("Email already exists");
        }

        employee.setEmployeeId(employeeId);
        employee.setFullName(request.getFullName().trim());
        employee.setEmail(email);
        employee.setPhone(request.getPhone().trim());
        employee.setDepartment(findDepartment(request.getDepartmentId()));
        employee.setDesignation(request.getDesignation().trim());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setStatus(request.getStatus());
        employee.setGender(request.getGender());

        return EmployeeResponse.from(employeeRepository.save(employee));
    }

    @Transactional
    public void delete(Long id) {
        Employee employee = findActiveEmployee(id);
        employee.setActive(false);
        employeeRepository.save(employee);
    }

    @Transactional
    public EmployeeResponse updateProfilePhoto(Long id, MultipartFile file) {
        Employee employee = findActiveEmployee(id);
        String previous = employee.getProfilePhoto();
        String storedPath = fileStorageService.store(file, "employees");
        employee.setProfilePhoto(storedPath);
        EmployeeResponse response = EmployeeResponse.from(employeeRepository.save(employee));
        fileStorageService.deleteQuietly(previous);
        return response;
    }

    private Employee findActiveEmployee(Long id) {
        return employeeRepository
                .findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
    }

    private Department findDepartment(Long departmentId) {
        return departmentRepository
                .findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }

    private String normalizeEmployeeId(String employeeId) {
        return employeeId.trim().toUpperCase();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
