package com.saparbek.task_manager_pro.modules.notification.service;

import com.saparbek.task_manager_pro.modules.notification.dto.NotificationResponse;
import com.saparbek.task_manager_pro.modules.notification.model.Notification;
import com.saparbek.task_manager_pro.modules.notification.repository.NotificationRepository;
import com.saparbek.task_manager_pro.modules.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void notifyUser(User user, String title, String content) {
        Notification notification = Notification.builder()
                .title(title)
                .content(content)
                .recipient(user)
                .timestamp(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        NotificationResponse dto = new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getContent(),
                notification.getTimestamp().toString(),
                notification.isRead()
        );
        messagingTemplate.convertAndSend("/topic/notifications/" + user.getId(), dto);


    }

    public List<NotificationResponse> getUserNotifications(UUID userId) {
        return notificationRepository.
                findByRecipientIdOrderByTimestampDesc(userId)
                .stream()
                .map(n -> new NotificationResponse(
                        n.getId(),
                        n.getTitle(),
                        n.getContent(),
                        n.getTimestamp() != null ? n.getTimestamp().toString() : "N/A",
                        n.isRead()
                ))
                .toList();
    }

    public void markAsRead(UUID id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAllRead(UUID userId) {
        List<Notification> notifications = notificationRepository.findByRecipientIdAndReadFalse(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}
