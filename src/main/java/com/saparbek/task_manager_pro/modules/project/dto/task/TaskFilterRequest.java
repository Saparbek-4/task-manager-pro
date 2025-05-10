package com.saparbek.task_manager_pro.modules.project.dto.task;

import com.saparbek.task_manager_pro.modules.project.model.enums.TaskPriority;
import com.saparbek.task_manager_pro.modules.project.model.enums.TaskStatus;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class TaskFilterRequest {
    private List<TaskStatus> statuses;
    private List<TaskPriority> priorities;
    private UUID assigneeId;
    private UUID columnId;
    private Boolean overdue;
    private LocalDate deadlineBefore;
    private LocalDate deadlineAfter;
    private String sortBy;
    private String sortDirection;
    private Integer pageSize;
}
