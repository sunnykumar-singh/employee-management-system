package com.ems.repository;

import com.ems.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DepartmentRepository extends JpaRepository<Department, Long>, JpaSpecificationExecutor<Department> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    boolean existsByDepartmentIdIgnoreCase(String departmentId);

    boolean existsByDepartmentIdIgnoreCaseAndIdNot(String departmentId, Long id);
}
