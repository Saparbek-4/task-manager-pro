package com.saparbek.task_manager_pro.modules.project.service;

import com.saparbek.task_manager_pro.modules.activity.model.ActivityEvent;
import com.saparbek.task_manager_pro.modules.activity.service.ActivityLogService;
import com.saparbek.task_manager_pro.modules.project.dto.project.ProjectRequest;
import com.saparbek.task_manager_pro.modules.project.dto.project.ProjectResponse;
import com.saparbek.task_manager_pro.modules.project.model.Project;
import com.saparbek.task_manager_pro.modules.project.model.enums.ProjectStatus;
import com.saparbek.task_manager_pro.modules.project.model.UserProject;
import com.saparbek.task_manager_pro.modules.project.repository.ProjectMemberRepository;
import com.saparbek.task_manager_pro.modules.project.repository.ProjectRepository;
import com.saparbek.task_manager_pro.modules.project.repository.TaskRepository;
import com.saparbek.task_manager_pro.modules.user.model.Role;
import com.saparbek.task_manager_pro.modules.user.model.User;
import com.saparbek.task_manager_pro.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final ActivityLogService activityLogService;
    private final TaskRepository taskRepository;

    public List<ProjectResponse> getProjectsByUser(String email) {
        List<Project> ownedProjects = projectRepository.findAllByCreatedBy(email);

        List<UserProject> userProjects = projectMemberRepository.findAllByUserEmail(email);
        List<Project> memberProjects = userProjects.stream()
                .map(UserProject::getProject)
                .toList();

        // Объединяем, убираем дубликаты (по id)
        Set<UUID> seen = new HashSet<>();
        List<Project> all = Stream.concat(ownedProjects.stream(), memberProjects.stream())
                .filter(p -> seen.add(p.getId()))
                .toList();

        return all.stream().map(this::mapToResponse).toList();
    }

    public ProjectResponse getProjectByIdAndUser(UUID id, String email) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isOwner = project.getCreatedBy().equals(email);
        boolean isMember = projectMemberRepository.existsByUserEmailAndProjectId(email, id);

        if (!isOwner && !isMember) {
            throw new RuntimeException("Access denied");
        }

        return mapToResponse(project);
    }


    public ProjectResponse createProject(ProjectRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(email)
                .owner(user)
                .createdAt(LocalDateTime.now())
                .build();

        return mapToResponse(projectRepository.save(project));
    }

    public ProjectResponse updateProject(UUID id, ProjectRequest request, String email) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        checkProjectAccess(id, email);

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        return mapToResponse(projectRepository.save(project));
    }

    public void deleteProject(UUID id, String email) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getCreatedBy().equals(email)) {
            throw new RuntimeException("Access denied");
        }

        projectRepository.delete(project);
    }

    public void addUserToProjectByEmail(UUID projectId, String email, String adminUsername) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь с таким email не найден"));

        if (projectMemberRepository.existsByUserIdAndProjectId(user.getId(), projectId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Пользователь уже является участником проекта");
        }

        UserProject member = UserProject.builder()
                .project(project)
                .user(user)
                .role(Role.USER)
                .build();

        projectMemberRepository.save(member);

        activityLogService.logEvent(
                ActivityEvent.USER_ADDED_TO_PROJECT,
                adminUsername,
                user.getUsername(),
                null,
                projectId
        );
    }

    private void checkProjectAccess(UUID projectId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("⛔ Только администраторы могут изменять проект");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

        boolean isOwner = project.getCreatedBy().equals(email);

        if (!isOwner) {
            throw new RuntimeException("⛔ Доступ запрещён: вы не владелец проекта");
        }
    }



    public ProjectResponse patchProject(UUID id, Map<String, Object> updates, String email) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        checkProjectAccess(id, email);

        if (updates.containsKey("status")) {
            String statusStr = updates.get("status").toString().toUpperCase();
            ProjectStatus status = ProjectStatus.valueOf(statusStr);
            project.setStatus(status);
        }

        return mapToResponse(projectRepository.save(project));
    }


    private ProjectResponse mapToResponse(Project project) {
        int taskCount = taskRepository.countByColumnBoardProject(project);
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .createdBy(project.getCreatedBy())
                .ownerUsername(project.getOwner() != null ? project.getOwner().getUsername() : null)
                .createdAt(project.getCreatedAt())
                .status(project.getStatus() != null ? project.getStatus().name().toLowerCase() : "active")
                .taskCount(taskCount)
                .build();
    }

}

