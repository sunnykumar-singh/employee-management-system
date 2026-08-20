package com.ems.repository;

import com.ems.entity.Employee;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

    @EntityGraph(attributePaths = "department")
    Optional<Employee> findByIdAndActiveTrue(Long id);

    @EntityGraph(attributePaths = "department")
    Optional<Employee> findByEmailIgnoreCaseAndActiveTrue(String email);

    @Override
    @EntityGraph(attributePaths = "department")
    Page<Employee> findAll(Specification<Employee> spec, Pageable pageable);

    boolean existsByEmployeeIdIgnoreCase(String employeeId);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmployeeIdIgnoreCaseAndIdNot(String employeeId, Long id);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);

    boolean existsByDepartmentIdAndActiveTrue(Long departmentId);

    List<Employee> findByDepartmentIdAndActiveFalse(Long departmentId);

    long countByDepartmentIdAndActiveTrue(Long departmentId);
}
