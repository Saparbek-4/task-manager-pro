package com.saparbek.task_manager_pro.modules.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponse {
    private UUID id;
    private String title;
    private String content;
    private String timestamp;
    private boolean read;
}
