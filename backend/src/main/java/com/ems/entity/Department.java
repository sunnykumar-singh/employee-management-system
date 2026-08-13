package com.ems.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "departments",
        uniqueConstraints = {
            @UniqueConstraint(name = "uk_departments_department_id", columnNames = "department_id"),
            @UniqueConstraint(name = "uk_departments_name", columnNames = "name")
        })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "department_id", nullable = false, length = 20)
    private String departmentId;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 120)
    private String head;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DepartmentStatus status;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        normalize();
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
        if (status == null) {
            status = DepartmentStatus.ACTIVE;
        }
    }

    @PreUpdate
    void onUpdate() {
        normalize();
        updatedAt = Instant.now();
    }

    private void normalize() {
        if (departmentId != null) {
            departmentId = departmentId.trim().toUpperCase();
        }
        if (name != null) {
            name = name.trim();
        }
        if (head != null) {
            head = head.trim();
        }
        if (description != null) {
            description = description.trim();
        }
    }
}
