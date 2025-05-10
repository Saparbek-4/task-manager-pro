package com.saparbek.task_manager_pro.modules.project.model;

import com.saparbek.task_manager_pro.modules.project.model.enums.ProjectStatus;
import com.saparbek.task_manager_pro.modules.user.model.User;
import jakarta.persistence.*;
import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String description;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    private User owner;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProjectStatus status = ProjectStatus.ACTIVE;

    @Builder.Default
    private int taskCount = 0;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Board> boards = new ArrayList<>();

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

}

