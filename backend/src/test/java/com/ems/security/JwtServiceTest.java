package com.ems.security;

import static org.assertj.core.api.Assertions.assertThat;

import com.ems.config.JwtProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        JwtProperties properties = new JwtProperties();
        properties.setSecret("ThisIsADevelopmentOnlySecretKeyThatIsAtLeastThirtyTwoBytes");
        properties.setExpirationMs(3_600_000L);
        properties.setIssuer("employee-management-system");
        jwtService = new JwtService(properties);
    }

    @Test
    void generatesAndValidatesToken() {
        String token = jwtService.generateToken("admin");

        assertThat(jwtService.isTokenValid(token)).isTrue();
        assertThat(jwtService.extractUsername(token)).isEqualTo("admin");
    }

    @Test
    void rejectsInvalidToken() {
        assertThat(jwtService.isTokenValid("not-a-valid-token")).isFalse();
    }

    @Test
    void tokenIsValidForMatchingUser() {
        String token = jwtService.generateToken("admin@company.com");
        org.springframework.security.core.userdetails.UserDetails userDetails =
                org.springframework.security.core.userdetails.User.withUsername("admin@company.com")
                        .password("secret")
                        .roles("ADMIN")
                        .build();

        assertThat(jwtService.isTokenValid(token, userDetails)).isTrue();
    }
}
