package com.saparbek.task_manager_pro.modules.project.dto.project;

import com.saparbek.task_manager_pro.modules.user.model.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.util.UUID;

@Data
public class ProjectMemberRequest {
    private UUID userId;
    @Enumerated(EnumType.STRING)
    private Role role;
    private String email;
}