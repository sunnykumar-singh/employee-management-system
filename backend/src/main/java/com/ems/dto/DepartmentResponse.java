package com.ems.dto;

import com.ems.entity.Department;
import com.ems.entity.DepartmentStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DepartmentResponse {

    private Long id;
    private String departmentId;
    private String name;
    private String head;
    private String description;
    private DepartmentStatus status;
    private long employeeCount;

    public static DepartmentResponse from(Department department, long employeeCount) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .departmentId(department.getDepartmentId())
                .name(department.getName())
                .head(department.getHead())
                .description(department.getDescription())
                .status(department.getStatus())
                .employeeCount(employeeCount)
                .build();
    }
}
