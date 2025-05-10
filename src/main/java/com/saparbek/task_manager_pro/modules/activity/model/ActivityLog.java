package com.saparbek.task_manager_pro.modules.activity.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "activity_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private ActivityEvent event;

    @Column(name = "username")
    private String user;

    private String targetUser;

    private UUID taskId;

    private LocalDateTime timestamp;

    @Column(nullable = false)
    private UUID projectId;
}
