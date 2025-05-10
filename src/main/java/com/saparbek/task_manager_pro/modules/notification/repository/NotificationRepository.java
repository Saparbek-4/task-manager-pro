package com.saparbek.task_manager_pro.modules.notification.repository;

import com.saparbek.task_manager_pro.modules.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByRecipientIdOrderByTimestampDesc(UUID userId);
    List<Notification> findByRecipientIdAndReadFalse(UUID userId);
}

