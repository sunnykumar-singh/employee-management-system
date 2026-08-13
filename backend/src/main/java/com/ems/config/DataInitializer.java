package com.ems.config;

import com.ems.entity.Department;
import com.ems.entity.DepartmentStatus;
import com.ems.entity.Role;
import com.ems.entity.User;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final List<DepartmentSeed> DEPARTMENT_SEEDS = List.of(
            new DepartmentSeed("DEP001", "Engineering", "John Doe", "Handles product development and technical operations"),
            new DepartmentSeed("DEP002", "Marketing", "Sarah Smith", "Handles branding, promotions and market research"),
            new DepartmentSeed("DEP003", "Sales", "Michael Brown", "Responsible for sales, client relations and revenue growth"),
            new DepartmentSeed("DEP004", "HR", "Emily Johnson", "Manages recruitment, employee relations and policies"),
            new DepartmentSeed("DEP005", "Finance", "David Wilson", "Handles budgeting, accounts and financial planning"));

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createUserIfMissing("Admin User", "admin@company.com", "Admin@123", Role.ADMIN);
        createUserIfMissing("John Doe", "employee@company.com", "Employee@123", Role.EMPLOYEE);
        seedDepartments();
    }

    private void createUserIfMissing(String fullName, String email, String rawPassword, Role role) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return;
        }

        userRepository.save(User.builder()
                .fullName(fullName)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .role(role)
                .enabled(true)
                .build());

        log.info("Seeded {} user: {}", role, email);
    }

    private void seedDepartments() {
        DEPARTMENT_SEEDS.forEach(seed -> {
            if (departmentRepository.existsByNameIgnoreCase(seed.name())) {
                return;
            }

            departmentRepository.save(Department.builder()
                    .departmentId(seed.departmentId())
                    .name(seed.name())
                    .head(seed.head())
                    .description(seed.description())
                    .status(DepartmentStatus.ACTIVE)
                    .build());
            log.info("Seeded department: {}", seed.name());
        });
    }

    private record DepartmentSeed(String departmentId, String name, String head, String description) {}
}
