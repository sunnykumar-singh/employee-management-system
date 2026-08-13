package com.ems.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaveDecisionRequest {

    @Size(max = 500, message = "Remarks must be at most 500 characters.")
    private String remarks;
}
