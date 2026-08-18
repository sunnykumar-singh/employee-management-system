package com.ems.service;

import com.ems.dto.DepartmentRequest;
import com.ems.dto.DepartmentResponse;
import com.ems.dto.PageResponse;
import com.ems.entity.Department;
import com.ems.entity.DepartmentStatus;
import com.ems.entity.Employee;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.DepartmentSpecifications;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public DepartmentResponse create(DepartmentRequest request) {
        String departmentId = normalizeDepartmentId(request.getDepartmentId());
        String name = normalizeName(request.getName());

        if (departmentRepository.existsByDepartmentIdIgnoreCase(departmentId)) {
            throw new ConflictException("Department ID already exists");
        }
        if (departmentRepository.existsByNameIgnoreCase(name)) {
            throw new ConflictException("Department name already exists");
        }

        Department department = Department.builder()
                .departmentId(departmentId)
                .name(name)
                .head(request.getHead().trim())
                .description(request.getDescription().trim())
                .status(request.getStatus())
                .build();

        return toResponse(departmentRepository.save(department));
    }

    @Transactional(readOnly = true)
    public PageResponse<DepartmentResponse> list(String search, DepartmentStatus status, Pageable pageable) {
        Specification<Department> specification = Specification.<Department>unrestricted()
                .and(DepartmentSpecifications.searchByName(search))
                .and(DepartmentSpecifications.hasStatus(status));

        Page<DepartmentResponse> page = departmentRepository.findAll(specification, pageable).map(this::toResponse);
        return PageResponse.from(page);
    }

    @Transactional(readOnly = true)
    public DepartmentResponse getById(Long id) {
        return toResponse(findDepartment(id));
    }

    @Transactional
    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department department = findDepartment(id);
        String departmentId = normalizeDepartmentId(request.getDepartmentId());
        String name = normalizeName(request.getName());

        if (departmentRepository.existsByDepartmentIdIgnoreCaseAndIdNot(departmentId, id)) {
            throw new ConflictException("Department ID already exists");
        }
        if (departmentRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new ConflictException("Department name already exists");
        }

        department.setDepartmentId(departmentId);
        department.setName(name);
        department.setHead(request.getHead().trim());
        department.setDescription(request.getDescription().trim());
        department.setStatus(request.getStatus());

        return toResponse(departmentRepository.save(department));
    }

    @Transactional
    public void delete(Long id) {
        Department department = findDepartment(id);
        // Match the UI employeeCount: only active employees block deletion.
        if (employeeRepository.existsByDepartmentIdAndActiveTrue(id)) {
            throw new ConflictException("Cannot delete a department that is assigned to employees");
        }

        // Soft-deleted employees still hold the FK; remove them (and related rows) first.
        List<Employee> inactiveEmployees = employeeRepository.findByDepartmentIdAndActiveFalse(id);
        for (Employee employee : inactiveEmployees) {
            attendanceRepository.deleteByEmployeeId(employee.getId());
            leaveRepository.deleteByEmployeeId(employee.getId());
            employeeRepository.delete(employee);
        }

        departmentRepository.delete(department);
    }

    @Transactional
    public DepartmentResponse updateHeadPhoto(Long id, MultipartFile file) {
        Department department = findDepartment(id);
        String previous = department.getHeadPhoto();
        String storedPath = fileStorageService.store(file, "departments");
        department.setHeadPhoto(storedPath);
        DepartmentResponse response = toResponse(departmentRepository.save(department));
        fileStorageService.deleteQuietly(previous);
        return response;
    }

    private Department findDepartment(Long id) {
        return departmentRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }

    private DepartmentResponse toResponse(Department department) {
        return DepartmentResponse.from(
                department, employeeRepository.countByDepartmentIdAndActiveTrue(department.getId()));
    }

    private String normalizeDepartmentId(String departmentId) {
        return departmentId.trim().toUpperCase();
    }

    private String normalizeName(String name) {
        return name.trim();
    }
}
