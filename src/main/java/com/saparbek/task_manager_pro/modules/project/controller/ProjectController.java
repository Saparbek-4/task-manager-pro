package com.saparbek.task_manager_pro.modules.project.controller;

import com.saparbek.task_manager_pro.modules.project.dto.project.ProjectMemberRequest;
import com.saparbek.task_manager_pro.modules.project.dto.project.ProjectMemberResponse;
import com.saparbek.task_manager_pro.modules.project.dto.project.ProjectRequest;
import com.saparbek.task_manager_pro.modules.project.dto.project.ProjectResponse;
import com.saparbek.task_manager_pro.modules.project.service.ProjectService;
import com.saparbek.task_manager_pro.modules.project.service.UserProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final UserProjectService userProjectService;

    // ✅ Получить все проекты текущего пользователя
    @GetMapping
    public List<ProjectResponse> getAll(@AuthenticationPrincipal UserDetails user) {
        return projectService.getProjectsByUser(user.getUsername());
    }

    // 🔍 Получить проект по ID
    @GetMapping("/{id}")
    public ProjectResponse getById(@PathVariable UUID id,
                                   @AuthenticationPrincipal UserDetails user) {
        return projectService.getProjectByIdAndUser(id, user.getUsername());
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<ProjectResponse> patchProject(@PathVariable UUID id,
                                                        @RequestBody Map<String, Object> updates,
                                                        @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(projectService.patchProject(id, updates, user.getUsername()));
    }

    // 🆕 Создать проект
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ProjectResponse> create(@RequestBody ProjectRequest request,
                                                  @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(projectService.createProject(request, user.getUsername()));
    }

    // 📝 Обновить проект
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(@PathVariable UUID id,
                                                  @RequestBody ProjectRequest request,
                                                  @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(projectService.updateProject(id, request, user.getUsername()));
    }

    // 🗑️ Удалить проект
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id,
                                       @AuthenticationPrincipal UserDetails user) {
        projectService.deleteProject(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    // 👥 Добавить пользователя в проект по email
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{projectId}/members")
    public ResponseEntity<String> addMemberToProject(@PathVariable UUID projectId,
                                                     @RequestBody ProjectMemberRequest request,
                                                     @AuthenticationPrincipal UserDetails user) {
        projectService.addUserToProjectByEmail(projectId, request.getEmail(), user.getUsername());
        return ResponseEntity.ok("✅ Пользователь добавлен в проект!");
    }

    // 📋 Получить всех участников проекта
    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMemberResponse>> listUsers(@PathVariable UUID projectId) {
        return ResponseEntity.ok(userProjectService.getUserResponses(projectId));
    }

    // ❌ Удалить пользователя из проекта
    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Void> removeUser(@PathVariable UUID projectId,
                                           @PathVariable UUID userId) {
        userProjectService.removeUserFromProject(projectId, userId);
        return ResponseEntity.noContent().build();
    }
}


