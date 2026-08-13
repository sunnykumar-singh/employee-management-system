package com.ems.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private String token;
    private String tokenType;
    private long expiresIn;
    private UserResponse user;
}
