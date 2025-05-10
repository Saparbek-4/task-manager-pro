package com.saparbek.task_manager_pro.modules.project.dto.column;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ColumnResponse {
    private UUID id;
    private String name;
    private UUID boardId;
}
