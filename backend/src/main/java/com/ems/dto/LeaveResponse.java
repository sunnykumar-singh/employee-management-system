package com.ems.dto;

import com.ems.entity.Leave;
import com.ems.entity.LeaveStatus;
import com.ems.entity.LeaveType;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LeaveResponse {

    private Long id;
    private EmployeeSummary employee;
    private LeaveType leaveType;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fromDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate toDate;

    private int days;
    private String reason;
    private LeaveStatus status;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate appliedOn;

    private String remarks;
    private LeaveBalanceResponse leaveBalance;

    public static LeaveResponse from(Leave leave, LeaveBalanceResponse leaveBalance) {
        return LeaveResponse.builder()
                .id(leave.getId())
                .employee(EmployeeSummary.from(leave.getEmployee()))
                .leaveType(leave.getLeaveType())
                .fromDate(leave.getFromDate())
                .toDate(leave.getToDate())
                .days(leave.getDays())
                .reason(leave.getReason())
                .status(leave.getStatus())
                .appliedOn(leave.getAppliedOn())
                .remarks(leave.getRemarks())
                .leaveBalance(leaveBalance)
                .build();
    }
}
