package com.saparbek.task_manager_pro.modules.notification.controller;

import com.saparbek.task_manager_pro.modules.notification.dto.NotificationResponse;
import com.saparbek.task_manager_pro.modules.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @MessageMapping("/notify")        // клиент отправляет на /app/notify
    @SendTo("/topic/notifications")   // все подписчики получают
    public String sendNotification(String message) {
        return "🔔 Уведомление: " + message;
    }

    @PutMapping("/{notificationId}/read")
    public void markAsRead(@PathVariable UUID notificationId) {
        notificationService.markAsRead(notificationId);
    }

    @PutMapping("/{userId}/mark-all-read")
    public void markAsAllRead(@PathVariable UUID userId) {
        notificationService.markAllRead(userId);
    }

    @GetMapping("/{userId}")
    public List<NotificationResponse> getUserNotifications(@PathVariable UUID userId) {
        return notificationService.getUserNotifications(userId);
    }
}