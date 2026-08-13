package com.ems.repository;

import com.ems.entity.Leave;
import com.ems.entity.LeaveStatus;
import com.ems.entity.LeaveType;
import jakarta.persistence.criteria.JoinType;
import java.time.LocalDate;
import org.springframework.data.jpa.domain.Specification;

public final class LeaveSpecifications {

    private LeaveSpecifications() {}

    public static Specification<Leave> search(String search) {
        if (search == null || search.isBlank()) {
            return null;
        }

        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, builder) -> {
            if (query != null) {
                query.distinct(true);
            }
            var employee = root.join("employee", JoinType.INNER);
            return builder.or(
                    builder.like(builder.lower(employee.get("employeeId")), pattern),
                    builder.like(builder.lower(employee.get("fullName")), pattern));
        };
    }

    public static Specification<Leave> hasLeaveType(LeaveType leaveType) {
        if (leaveType == null) {
            return null;
        }
        return (root, query, builder) -> builder.equal(root.get("leaveType"), leaveType);
    }

    public static Specification<Leave> hasStatus(LeaveStatus status) {
        if (status == null) {
            return null;
        }
        return (root, query, builder) -> builder.equal(root.get("status"), status);
    }

    public static Specification<Leave> hasDepartment(Long departmentId) {
        if (departmentId == null) {
            return null;
        }
        return (root, query, builder) -> {
            if (query != null) {
                query.distinct(true);
            }
            return builder.equal(root.join("employee", JoinType.INNER).get("department").get("id"), departmentId);
        };
    }

    public static Specification<Leave> coversDate(LocalDate date) {
        if (date == null) {
            return null;
        }
        return (root, query, builder) -> builder.and(
                builder.lessThanOrEqualTo(root.get("fromDate"), date),
                builder.greaterThanOrEqualTo(root.get("toDate"), date));
    }
}
