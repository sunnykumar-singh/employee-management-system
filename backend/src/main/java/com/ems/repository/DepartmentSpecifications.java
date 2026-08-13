package com.ems.repository;

import com.ems.entity.Department;
import com.ems.entity.DepartmentStatus;
import org.springframework.data.jpa.domain.Specification;

public final class DepartmentSpecifications {

    private DepartmentSpecifications() {}

    public static Specification<Department> searchByName(String search) {
        if (search == null || search.isBlank()) {
            return null;
        }

        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, builder) -> builder.like(builder.lower(root.get("name")), pattern);
    }

    public static Specification<Department> hasStatus(DepartmentStatus status) {
        if (status == null) {
            return null;
        }
        return (root, query, builder) -> builder.equal(root.get("status"), status);
    }
}
