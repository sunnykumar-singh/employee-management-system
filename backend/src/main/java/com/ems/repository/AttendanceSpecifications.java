package com.ems.repository;

import com.ems.entity.Attendance;
import com.ems.entity.AttendanceStatus;
import jakarta.persistence.criteria.JoinType;
import java.time.LocalDate;
import org.springframework.data.jpa.domain.Specification;

public final class AttendanceSpecifications {

    private AttendanceSpecifications() {}

    public static Specification<Attendance> search(String search) {
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

    public static Specification<Attendance> hasDate(LocalDate date) {
        if (date == null) {
            return null;
        }
        return (root, query, builder) -> builder.equal(root.get("date"), date);
    }

    public static Specification<Attendance> hasStatus(AttendanceStatus status) {
        if (status == null) {
            return null;
        }
        return (root, query, builder) -> builder.equal(root.get("status"), status);
    }

    public static Specification<Attendance> hasDepartment(Long departmentId) {
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
}
