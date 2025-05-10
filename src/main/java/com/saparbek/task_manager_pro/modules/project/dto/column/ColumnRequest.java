package com.saparbek.task_manager_pro.modules.project.dto.column;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColumnRequest {
    private UUID boardId;
    private String name;
}
