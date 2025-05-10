package com.saparbek.task_manager_pro.modules.project.dto.task;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WeeklyStats {
    private String day;
    private long completed;
    private long pending;
}

