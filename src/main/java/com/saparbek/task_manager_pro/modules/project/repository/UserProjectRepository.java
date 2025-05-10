package com.saparbek.task_manager_pro.modules.project.repository;

import com.saparbek.task_manager_pro.modules.project.model.UserProject;
import com.saparbek.task_manager_pro.modules.user.model.User;
import com.saparbek.task_manager_pro.modules.project.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserProjectRepository extends JpaRepository<UserProject, UUID> {
    List<UserProject> findByProject(Project project);
    Optional<UserProject> findByUserAndProject(User user, Project project);
}
