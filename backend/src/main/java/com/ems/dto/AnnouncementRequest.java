package com.ems.dto;

import com.ems.entity.AnnouncementCategory;
import com.ems.entity.AnnouncementStatus;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnnouncementRequest {

    @NotBlank(message = "Title is required.")
    @Size(max = 180, message = "Title must be at most 180 characters.")
    private String title;

    @NotNull(message = "Category is required.")
    private AnnouncementCategory category;

    @NotNull(message = "Department is required.")
    private Long departmentId;

    @NotBlank(message = "Message is required.")
    @Size(max = 2000, message = "Message must be at most 2000 characters.")
    private String message;

    private AnnouncementStatus status;

    private Instant scheduledAt;

    @AssertTrue(message = "Scheduled date and time are required for a scheduled announcement.")
    public boolean isScheduleValid() {
        if (status != AnnouncementStatus.SCHEDULED) {
            return true;
        }
        return scheduledAt != null;
    }
}
