package com.ems.dto;

import com.ems.entity.DepartmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepartmentRequest {

    @NotBlank(message = "Department ID is required.")
    @Size(max = 20, message = "Department ID must be at most 20 characters.")
    @Pattern(regexp = "^[A-Za-z0-9-]+$", message = "Department ID may contain only letters, numbers, and hyphens.")
    private String departmentId;

    @NotBlank(message = "Department name is required.")
    @Size(max = 120, message = "Department name must be at most 120 characters.")
    private String name;

    @NotBlank(message = "Department head is required.")
    @Size(max = 120, message = "Department head must be at most 120 characters.")
    private String head;

    @NotBlank(message = "Description is required.")
    @Size(max = 500, message = "Description must be at most 500 characters.")
    private String description;

    @NotNull(message = "Status is required.")
    private DepartmentStatus status;
}
