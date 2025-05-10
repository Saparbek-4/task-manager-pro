package com.saparbek.task_manager_pro.modules.project.dto.board;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class BoardResponse {
    private UUID id;
    private String name;
    private UUID projectId;
    private LocalDateTime createdAt;

}
