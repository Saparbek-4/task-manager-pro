package com.saparbek.task_manager_pro.modules.project.dto.project;

import com.saparbek.task_manager_pro.modules.user.model.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.util.UUID;

@Data
@Builder
@Getter
public class ProjectMemberResponse {
    private UUID userId;
    private String username;
    private String email;
    @Enumerated(EnumType.STRING)
    private Role role;
    private String avatarUrl;
}

