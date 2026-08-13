package com.ems.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnnouncementScheduleRequest {

    @NotNull(message = "Scheduled date and time are required.")
    @Future(message = "Scheduled date and time must be in the future.")
    private Instant scheduledAt;
}
