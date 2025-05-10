package com.saparbek.task_manager_pro.modules.project.dto.board;

import lombok.Data;

import java.util.UUID;

@Data
public class BoardRequest {
    private String name;
    private UUID projectId;
}
