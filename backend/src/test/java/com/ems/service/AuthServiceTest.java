package com.ems.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ems.config.JwtProperties;
import com.ems.dto.LoginRequest;
import com.ems.dto.LoginResponse;
import com.ems.entity.Role;
import com.ems.entity.User;
import com.ems.repository.UserRepository;
import com.ems.security.JwtService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private JwtProperties jwtProperties;

    @InjectMocks
    private AuthService authService;

    private LoginRequest request;
    private User user;

    @BeforeEach
    void setUp() {
        request = new LoginRequest();
        request.setEmail("admin@company.com");
        request.setPassword("Admin@123");

        user = User.builder()
                .id(1L)
                .fullName("Admin User")
                .email("admin@company.com")
                .password("encoded")
                .role(Role.ADMIN)
                .enabled(true)
                .build();
    }

    @Test
    void loginReturnsJwtAndUserDetails() {
        when(userRepository.findByEmailIgnoreCase("admin@company.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(), any())).thenReturn("jwt-token");
        when(jwtProperties.getExpirationMs()).thenReturn(86_400_000L);

        LoginResponse response = authService.login(request);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getTokenType()).isEqualTo("Bearer");
        assertThat(response.getExpiresIn()).isEqualTo(86_400_000L);
        assertThat(response.getUser().getEmail()).isEqualTo("admin@company.com");
        assertThat(response.getUser().getRole()).isEqualTo(Role.ADMIN);
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void loginRejectsInvalidCredentials() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThatThrownBy(() -> authService.login(request)).isInstanceOf(BadCredentialsException.class);
    }
}
