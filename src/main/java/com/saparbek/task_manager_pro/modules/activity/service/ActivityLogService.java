package com.saparbek.task_manager_pro.modules.activity.service;

import com.saparbek.task_manager_pro.modules.activity.model.ActivityEvent;
import com.saparbek.task_manager_pro.modules.activity.model.ActivityLog;
import com.saparbek.task_manager_pro.modules.activity.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository repository;

    public void logEvent(ActivityEvent event, String user, String targetUser, UUID taskId, UUID projectId) {
        ActivityLog log = ActivityLog.builder()
                .event(event)
                .user(user)
                .targetUser(targetUser)
                .taskId(taskId)
                .timestamp(LocalDateTime.now())
                .projectId(projectId)
                .build();
        repository.save(log);
    }

    public List<ActivityLog> getProjectHistory(UUID projectId) {
        return repository.findAllByProjectIdOrderByTimestampDesc(projectId);
    }
}
