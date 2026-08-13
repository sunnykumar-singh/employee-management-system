package com.ems.dto;

import com.ems.entity.LeaveType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LeaveBalanceResponse {

    private LeaveType leaveType;
    private int entitled;
    private int used;
    private int remaining;
}
