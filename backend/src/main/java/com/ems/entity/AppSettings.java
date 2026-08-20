package com.ems.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "app_settings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppSettings {

    @Id
    private Long id;

    @Column(nullable = false, length = 160)
    private String companyName;

    @Column(nullable = false, length = 160)
    private String companyEmail;

    @Column(nullable = false, length = 40)
    private String companyPhone;

    @Column(nullable = false, length = 500)
    private String companyAddress;

    @Column(nullable = false)
    private boolean emailNotifications;

    @Column(nullable = false)
    private boolean leaveNotifications;

    @Column(nullable = false)
    private boolean announcementNotifications;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }
}
