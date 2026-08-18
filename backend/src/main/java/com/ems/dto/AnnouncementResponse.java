package com.ems.dto;

import com.ems.entity.Announcement;
import com.ems.entity.AnnouncementCategory;
import com.ems.entity.AnnouncementStatus;
import java.time.Instant;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AnnouncementResponse {

    private Long id;
    private String announcementId;
    private String title;
    private AnnouncementCategory category;
    private DepartmentSummary department;
    private String message;
    private AnnouncementStatus status;
    private Instant scheduledAt;
    private Instant publishedAt;
    private Instant archivedAt;
    private Instant createdAt;

    public static AnnouncementResponse from(Announcement announcement) {
        return AnnouncementResponse.builder()
                .id(announcement.getId())
                .announcementId(announcement.getAnnouncementId())
                .title(announcement.getTitle())
                .category(announcement.getCategory())
                .department(announcement.getDepartment() == null
                        ? DepartmentSummary.allDepartments()
                        : DepartmentSummary.from(announcement.getDepartment()))
                .message(announcement.getMessage())
                .status(announcement.getStatus())
                .scheduledAt(announcement.getScheduledAt())
                .publishedAt(announcement.getPublishedAt())
                .archivedAt(announcement.getArchivedAt())
                .createdAt(announcement.getCreatedAt())
                .build();
    }
}
