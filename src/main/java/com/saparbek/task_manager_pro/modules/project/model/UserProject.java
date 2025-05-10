package com.saparbek.task_manager_pro.modules.project.model;

import com.saparbek.task_manager_pro.modules.user.model.Role;
import com.saparbek.task_manager_pro.modules.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "user_project")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProject {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Enumerated(EnumType.STRING)
    private Role role;
}