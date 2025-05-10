package com.saparbek.task_manager_pro.modules.project.dto.project;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ProjectResponse {
    private UUID id;
    private String name;
    private String description;
    private String createdBy;
    private String ownerUsername; // из сущности User
    private LocalDateTime createdAt;
    private String status;
    private int taskCount;
}