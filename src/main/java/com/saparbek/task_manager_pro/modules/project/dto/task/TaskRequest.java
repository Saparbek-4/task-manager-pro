package com.saparbek.task_manager_pro.modules.project.dto.task;

import com.saparbek.task_manager_pro.modules.project.model.enums.TaskPriority;
import com.saparbek.task_manager_pro.modules.project.model.enums.TaskStatus;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Getter
public class TaskRequest {
    private String title;
    private String description;
    private TaskPriority priority;
    private TaskStatus status;
    private LocalDate deadline;
    private UUID columnId;
    private List<UUID> assigneeIds;
}