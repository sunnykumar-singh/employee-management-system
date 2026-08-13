package com.ems.dto;

import com.ems.entity.Employee;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EmployeeSummary {

    private Long id;
    private String employeeId;
    private String fullName;
    private String designation;
    private DepartmentSummary department;

    public static EmployeeSummary from(Employee employee) {
        return EmployeeSummary.builder()
                .id(employee.getId())
                .employeeId(employee.getEmployeeId())
                .fullName(employee.getFullName())
                .designation(employee.getDesignation())
                .department(DepartmentSummary.from(employee.getDepartment()))
                .build();
    }
}
