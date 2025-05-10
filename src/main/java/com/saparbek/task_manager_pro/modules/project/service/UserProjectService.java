package com.saparbek.task_manager_pro.modules.project.service;

import com.saparbek.task_manager_pro.modules.project.dto.project.ProjectMemberResponse;
import com.saparbek.task_manager_pro.modules.project.model.Project;
import com.saparbek.task_manager_pro.modules.project.model.UserProject;
import com.saparbek.task_manager_pro.modules.project.repository.ProjectRepository;
import com.saparbek.task_manager_pro.modules.project.repository.UserProjectRepository;
import com.saparbek.task_manager_pro.modules.user.model.Role;
import com.saparbek.task_manager_pro.modules.user.model.User;
import com.saparbek.task_manager_pro.modules.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProjectService {

    private final UserProjectRepository userProjectRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public void removeUserFromProject(UUID projectId, UUID userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProject userProject = userProjectRepository.findByUserAndProject(user, project)
                .orElseThrow(() -> new RuntimeException("User is not a member of this project"));

        userProjectRepository.delete(userProject);
    }


    public List<ProjectMemberResponse> getUserResponses(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return userProjectRepository.findByProject(project).stream()
                .map(up -> {
                    User user = up.getUser();
                    return ProjectMemberResponse.builder()
                            .userId(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .avatarUrl(user.getAvatarUrl()) // ✅ здесь добавлено
                            .role(up.getUser().getRole())
                            .build();
                })
                .toList();
    }

}