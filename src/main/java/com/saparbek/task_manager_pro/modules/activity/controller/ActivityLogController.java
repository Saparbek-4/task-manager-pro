package com.saparbek.task_manager_pro.modules.activity.controller;

import com.saparbek.task_manager_pro.modules.activity.model.ActivityLog;
import com.saparbek.task_manager_pro.modules.activity.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/activity")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping
    public ResponseEntity<List<ActivityLog>> getProjectActivity(@PathVariable UUID projectId) {
        return ResponseEntity.ok(activityLogService.getProjectHistory(projectId));
    }
}
