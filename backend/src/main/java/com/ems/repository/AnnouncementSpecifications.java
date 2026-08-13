package com.ems.repository;

import com.ems.entity.Announcement;
import com.ems.entity.AnnouncementStatus;
import org.springframework.data.jpa.domain.Specification;

public final class AnnouncementSpecifications {

    private AnnouncementSpecifications() {}

    public static Specification<Announcement> searchByTitle(String search) {
        if (search == null || search.isBlank()) {
            return null;
        }

        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, builder) -> builder.like(builder.lower(root.get("title")), pattern);
    }

    public static Specification<Announcement> hasStatus(AnnouncementStatus status) {
        if (status == null) {
            return null;
        }
        return (root, query, builder) -> builder.equal(root.get("status"), status);
    }

    public static Specification<Announcement> hasDepartment(Long departmentId) {
        if (departmentId == null) {
            return null;
        }
        return (root, query, builder) -> builder.equal(root.get("department").get("id"), departmentId);
    }
}
