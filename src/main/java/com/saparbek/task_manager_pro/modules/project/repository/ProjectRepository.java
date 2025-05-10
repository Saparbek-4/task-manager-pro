package com.saparbek.task_manager_pro.modules.project.repository;

import com.saparbek.task_manager_pro.modules.project.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    public List<Project> findAllByCreatedBy(String username);
}
