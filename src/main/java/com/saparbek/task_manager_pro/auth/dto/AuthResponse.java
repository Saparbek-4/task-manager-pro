package com.saparbek.task_manager_pro.auth.dto;

import com.saparbek.task_manager_pro.modules.user.model.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class AuthResponse {
    private UUID userId;
    private String accessToken;
    private String refreshToken;
    private String email;
    @Enumerated(EnumType.STRING)
    private Role role;
}

