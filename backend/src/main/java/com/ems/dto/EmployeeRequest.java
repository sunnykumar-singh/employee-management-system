package com.ems.dto;

import com.ems.entity.EmployeeStatus;
import com.ems.entity.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeRequest {

    @NotBlank(message = "Employee ID is required.")
    @Size(max = 20, message = "Employee ID must be at most 20 characters.")
    @Pattern(regexp = "^[A-Za-z0-9-]+$", message = "Employee ID may contain only letters, numbers, and hyphens.")
    private String employeeId;

    @NotBlank(message = "Full name is required.")
    @Size(max = 120, message = "Full name must be at most 120 characters.")
    private String fullName;

    @NotBlank(message = "Email is required.")
    @Email(message = "Enter a valid email address.")
    @Size(max = 160, message = "Email must be at most 160 characters.")
    private String email;

    @NotBlank(message = "Phone number is required.")
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must contain exactly 10 digits.")
    private String phone;

    @NotNull(message = "Department is required.")
    private Long departmentId;

    @NotBlank(message = "Designation is required.")
    @Size(max = 80, message = "Designation must be at most 80 characters.")
    private String designation;

    @NotNull(message = "Joining date is required.")
    @PastOrPresent(message = "Joining date cannot be in the future.")
    private LocalDate joiningDate;

    @NotNull(message = "Status is required.")
    private EmployeeStatus status;

    @NotNull(message = "Gender is required.")
    private Gender gender;
}
