package com.ems.repository;

import com.ems.entity.Employee;
import com.ems.entity.EmployeeStatus;
import org.springframework.data.jpa.domain.Specification;

public final class EmployeeSpecifications {

    private EmployeeSpecifications() {}

    public static Specification<Employee> isActive() {
        return (root, query, builder) -> builder.isTrue(root.get("active"));
    }

    public static Specification<Employee> search(String search) {
        if (search == null || search.isBlank()) {
            return null;
        }

        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, builder) -> builder.or(
                builder.like(builder.lower(root.get("employeeId")), pattern),
                builder.like(builder.lower(root.get("fullName")), pattern),
                builder.like(builder.lower(root.get("email")), pattern));
    }

    public static Specification<Employee> hasDepartment(Long departmentId) {
        if (departmentId == null) {
            return null;
        }
        return (root, query, builder) -> builder.equal(root.get("department").get("id"), departmentId);
    }

    public static Specification<Employee> hasStatus(EmployeeStatus status) {
        if (status == null) {
            return null;
        }
        return (root, query, builder) -> builder.equal(root.get("status"), status);
    }
}
