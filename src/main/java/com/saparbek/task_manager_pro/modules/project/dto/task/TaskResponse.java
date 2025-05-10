package com.saparbek.task_manager_pro.modules.project.dto.task;

import com.saparbek.task_manager_pro.modules.project.model.Task;
import com.saparbek.task_manager_pro.modules.project.model.enums.TaskPriority;
import com.saparbek.task_manager_pro.modules.project.model.enums.TaskStatus;
import com.saparbek.task_manager_pro.modules.user.model.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {

    private UUID id;
    private String title;
    private String description;
    private TaskPriority priority;
    private TaskStatus status;
    private LocalDate deadline;
    private List<UUID> assigneeIds;
    private UUID columnId;
    private List<String> assigneeUsernames;

    public static TaskResponse from(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .deadline(task.getDeadline())
                .columnId(task.getColumn().getId()) // ✅ важно
                .assigneeIds(task.getAssignees().stream()
                        .map(User::getId)
                        .toList())
                .assigneeUsernames(task.getAssignees().stream()
                        .map(User::getUsername)
                        .toList())
                .build();
    }


}