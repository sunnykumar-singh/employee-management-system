package com.ems.dto;

import com.ems.entity.LeaveType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaveRequest {

    @NotNull(message = "Employee is required.")
    private Long employeeId;

    @NotNull(message = "Leave type is required.")
    private LeaveType leaveType;

    @NotNull(message = "From date is required.")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fromDate;

    @NotNull(message = "To date is required.")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate toDate;

    @NotBlank(message = "Reason is required.")
    @Size(max = 500, message = "Reason must be at most 500 characters.")
    private String reason;

    @AssertTrue(message = "To date cannot be before from date.")
    public boolean isDateRangeValid() {
        if (fromDate == null || toDate == null) {
            return true;
        }
        return !toDate.isBefore(fromDate);
    }
}
