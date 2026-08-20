package com.ems.service;

import com.ems.config.JwtProperties;
import com.ems.dto.ChangePasswordRequest;
import com.ems.dto.LoginRequest;
import com.ems.dto.LoginResponse;
import com.ems.dto.ProfileUpdateRequest;
import com.ems.dto.UserResponse;
import com.ems.entity.User;
import com.ems.exception.BadRequestException;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.UserRepository;
import com.ems.security.JwtService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

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

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Authentication authentication) {
        return UserResponse.from(requireUser(authentication));
    }

    @Transactional
    public UserResponse updateProfilePhoto(Authentication authentication, MultipartFile file) {
        User user = requireUser(authentication);
        String previous = user.getProfilePhoto();
        String storedPath = fileStorageService.store(file, "users");
        user.setProfilePhoto(storedPath);
        UserResponse response = UserResponse.from(userRepository.save(user));
        fileStorageService.deleteQuietly(previous);
        return response;
    }

    @Transactional
    public LoginResponse updateProfile(Authentication authentication, ProfileUpdateRequest request) {
        User user = requireUser(authentication);
        String email = request.getEmail().trim().toLowerCase();
        if (!email.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("An account with this email already exists.");
        }

        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setAddress(request.getAddress());
        user.setEmergencyName(request.getEmergencyName());
        user.setEmergencyRelation(request.getEmergencyRelation());
        user.setEmergencyPhone(request.getEmergencyPhone());
        User updatedUser = userRepository.save(user);

        return LoginResponse.builder()
                .token(jwtService.generateToken(updatedUser.getEmail(), Map.of(
                        "userId", updatedUser.getId(),
                        "role", updatedUser.getRole().name())))
                .tokenType("Bearer")
                .expiresIn(jwtProperties.getExpirationMs())
                .user(UserResponse.from(updatedUser))
                .build();
    }

    @Transactional
    public void changePassword(Authentication authentication, ChangePasswordRequest request) {
        User user = requireUser(authentication);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect.");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BadRequestException("Choose a password different from your current password.");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User requireUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResourceNotFoundException("User not found");
        }
        return userRepository
                .findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
