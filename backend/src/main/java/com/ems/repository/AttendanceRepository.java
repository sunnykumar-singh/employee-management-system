package com.ems.repository;

import com.ems.entity.Attendance;
import com.ems.entity.AttendanceStatus;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AttendanceRepository extends JpaRepository<Attendance, Long>, JpaSpecificationExecutor<Attendance> {

    @Override
    @EntityGraph(attributePaths = {"employee", "employee.department"})
    Optional<Attendance> findById(Long id);

    @Override
    @EntityGraph(attributePaths = {"employee", "employee.department"})
    Page<Attendance> findAll(Specification<Attendance> spec, Pageable pageable);

    boolean existsByEmployeeIdAndDate(Long employeeId, LocalDate date);

    boolean existsByEmployeeIdAndDateAndIdNot(Long employeeId, LocalDate date, Long id);

    @EntityGraph(attributePaths = {"employee", "employee.department"})
    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);

    long countByEmployeeIdAndStatus(Long employeeId, AttendanceStatus status);

    void deleteByEmployeeId(Long employeeId);
}
