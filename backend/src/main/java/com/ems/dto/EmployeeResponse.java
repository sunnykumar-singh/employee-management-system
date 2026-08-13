package com.ems.dto;

import com.ems.entity.Employee;
import com.ems.entity.EmployeeStatus;
import com.ems.entity.Gender;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EmployeeResponse {

    private Long id;
    private String employeeId;
    private String fullName;
    private String email;
    private String phone;
    private DepartmentSummary department;
    private String designation;
    private LocalDate joiningDate;
    private EmployeeStatus status;
    private Gender gender;

    @JsonProperty("isActive")
    private boolean isActive;

    public static EmployeeResponse from(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .employeeId(employee.getEmployeeId())
                .fullName(employee.getFullName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .department(DepartmentSummary.from(employee.getDepartment()))
                .designation(employee.getDesignation())
                .joiningDate(employee.getJoiningDate())
                .status(employee.getStatus())
                .gender(employee.getGender())
                .isActive(employee.isActive())
                .build();
    }
}
