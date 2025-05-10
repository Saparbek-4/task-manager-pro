package com.saparbek.task_manager_pro.modules.project.repository;

import com.saparbek.task_manager_pro.modules.project.model.UserProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectMemberRepository extends JpaRepository<UserProject, UUID> {

    boolean existsByUserIdAndProjectId(UUID userId, UUID projectId);
    List<UserProject> findAllByUserEmail(String email);
    boolean existsByUserEmailAndProjectId(String email, UUID projectId);
}
