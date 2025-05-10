package com.saparbek.task_manager_pro.auth.controller;

import com.saparbek.task_manager_pro.auth.dto.AuthRequest;
import com.saparbek.task_manager_pro.auth.dto.AuthResponse;
import com.saparbek.task_manager_pro.auth.dto.RegisterRequest;
import com.saparbek.task_manager_pro.auth.service.AuthService;
import com.saparbek.task_manager_pro.auth.service.JwtService;
import com.saparbek.task_manager_pro.auth.service.TokenCleanupService;
import com.saparbek.task_manager_pro.auth.repository.TokenRepository;
import com.saparbek.task_manager_pro.auth.model.*;
import com.saparbek.task_manager_pro.modules.user.dto.UserResponse;
import com.saparbek.task_manager_pro.modules.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final TokenCleanupService tokenCleanupService;

    @GetMapping("/test-cleanup")
    public ResponseEntity<String> testCleanup() {
        tokenCleanupService.removeExpiredTokens();
        return ResponseEntity.ok("✅ Очистка завершена");
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String oldRefreshToken = authHeader.substring(7);
        String username = jwtService.extractUsername(oldRefreshToken);

        if (username != null) {
            var user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (jwtService.isTokenValid(oldRefreshToken, user)) {

                // ❌ Удалить старый refreshToken
                tokenRepository.findByToken(oldRefreshToken)
                        .ifPresent(tokenRepository::delete);

                // ✅ Сгенерировать новый refreshToken и accessToken
                String newAccessToken = jwtService.generateToken(user);
                String newRefreshToken = jwtService.generateRefreshToken(user);

                // 💾 Сохранить в БД
                Token token = Token.builder()
                        .token(newRefreshToken)
                        .tokenType(TokenType.BEARER)
                        .expired(false)
                        .revoked(false)
                        .user(user)
                        .build();
                tokenRepository.save(token);

                return ResponseEntity.ok(AuthResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(newRefreshToken)
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build());
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(
                userRepository.findAll().stream()
                        .map(user -> new UserResponse(
                                user.getId(),
                                user.getEmail(),
                                user.getUsername(),
                                user.getAvatarUrl(),
                                user.getRole()
                        ))
                        .toList()
        );
    }

}
