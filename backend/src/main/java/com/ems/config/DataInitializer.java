package com.ems.config;

import com.ems.entity.Role;
import com.ems.entity.User;
import com.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createUserIfMissing("Admin User", "admin@company.com", "Admin@123", Role.ADMIN);
        createUserIfMissing("John Doe", "employee@company.com", "Employee@123", Role.EMPLOYEE);
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
}
