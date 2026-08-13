package com.ems.repository;

import com.ems.entity.Leave;
import com.ems.entity.LeaveStatus;
import com.ems.entity.LeaveType;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LeaveRepository extends JpaRepository<Leave, Long>, JpaSpecificationExecutor<Leave> {

    @Override
    @EntityGraph(attributePaths = {"employee", "employee.department"})
    Optional<Leave> findById(Long id);

    @Override
    @EntityGraph(attributePaths = {"employee", "employee.department"})
    Page<Leave> findAll(Specification<Leave> spec, Pageable pageable);

    @Query(
            """
            SELECT CASE WHEN COUNT(leaveRequest) > 0 THEN true ELSE false END
            FROM Leave leaveRequest
            WHERE leaveRequest.employee.id = :employeeId
              AND leaveRequest.status IN :statuses
              AND (:excludeId IS NULL OR leaveRequest.id <> :excludeId)
              AND leaveRequest.fromDate <= :toDate
              AND leaveRequest.toDate >= :fromDate
            """)
    boolean existsOverlappingLeave(
            @Param("employeeId") Long employeeId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            @Param("statuses") Collection<LeaveStatus> statuses,
            @Param("excludeId") Long excludeId);

    @Query(
            """
            SELECT COALESCE(SUM(leaveRequest.days), 0)
            FROM Leave leaveRequest
            WHERE leaveRequest.employee.id = :employeeId
              AND leaveRequest.leaveType = :leaveType
              AND leaveRequest.status IN :statuses
              AND (:excludeId IS NULL OR leaveRequest.id <> :excludeId)
            """)
    int sumDaysByEmployeeAndTypeAndStatuses(
            @Param("employeeId") Long employeeId,
            @Param("leaveType") LeaveType leaveType,
            @Param("statuses") Collection<LeaveStatus> statuses,
            @Param("excludeId") Long excludeId);
}
