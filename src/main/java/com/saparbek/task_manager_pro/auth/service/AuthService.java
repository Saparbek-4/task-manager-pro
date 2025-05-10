package com.saparbek.task_manager_pro.auth.service;

import com.saparbek.task_manager_pro.auth.dto.AuthRequest;
import com.saparbek.task_manager_pro.auth.dto.AuthResponse;
import com.saparbek.task_manager_pro.modules.user.security.CustomUserDetails;
import com.saparbek.task_manager_pro.auth.dto.RegisterRequest;
import com.saparbek.task_manager_pro.auth.repository.TokenRepository;
import com.saparbek.task_manager_pro.auth.model.*;
import com.saparbek.task_manager_pro.modules.user.model.User;
import com.saparbek.task_manager_pro.modules.user.repository.UserRepository;
import com.saparbek.task_manager_pro.modules.user.model.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenRepository tokenRepository;

    public AuthResponse register(RegisterRequest request) {
        var user = User.builder()
                .id(UUID.randomUUID())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);

        var userDetails = new CustomUserDetails(user);

        var accessToken = jwtService.generateToken(userDetails);
        var refreshToken = jwtService.generateRefreshToken(userDetails);

        saveUserToken(user, refreshToken);

        return AuthResponse.builder()
                .userId(user.getId())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        var userDetails = new CustomUserDetails(user);

        var accessToken = jwtService.generateToken(userDetails);
        var refreshToken = jwtService.generateRefreshToken(userDetails);

        saveUserToken(user, refreshToken);

        return AuthResponse.builder()
                .userId(user.getId())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    private void saveUserToken(User user, String tokenValue) {
        var token = Token.builder()
                .token(tokenValue)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .user(user)
                .build();
        tokenRepository.save(token);
    }
}

