package com.saparbek.task_manager_pro.modules.activity.repository;

import com.saparbek.task_manager_pro.modules.activity.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    List<ActivityLog> findAllByProjectIdOrderByTimestampDesc(UUID projectId);
}
