package com.ems.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EmployeeDashboardResponse {

    private long presentDays;
    private long absentDays;
    private long pendingLeaves;
    private int leaveBalance;
    private List<AnnouncementResponse> recentAnnouncements;
    private List<AttendanceResponse> recentAttendance;
    private LeaveResponse upcomingLeave;
}
