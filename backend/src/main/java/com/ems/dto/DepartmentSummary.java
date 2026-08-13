package com.ems.dto;

import com.ems.entity.Department;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DepartmentSummary {

    private Long id;
    private String departmentId;
    private String name;

    public static DepartmentSummary from(Department department) {
        return DepartmentSummary.builder()
                .id(department.getId())
                .departmentId(department.getDepartmentId())
                .name(department.getName())
                .build();
    }
}
