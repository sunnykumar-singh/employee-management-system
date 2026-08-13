package com.ems.service;

import com.ems.config.JwtProperties;
import com.ems.dto.LoginRequest;
import com.ems.dto.LoginResponse;
import com.ems.dto.UserResponse;
import com.ems.entity.User;
import com.ems.repository.UserRepository;
import com.ems.security.JwtService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.getPassword()));

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtService.generateToken(
                user.getEmail(),
                Map.of(
                        "userId", user.getId(),
                        "role", user.getRole().name()));

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(jwtProperties.getExpirationMs())
                .user(UserResponse.from(user))
                .build();
    }
}
