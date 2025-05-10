package com.saparbek.task_manager_pro.modules.project.controller;

import com.saparbek.task_manager_pro.modules.project.dto.task.TaskFilterRequest;
import com.saparbek.task_manager_pro.modules.project.dto.task.TaskRequest;
import com.saparbek.task_manager_pro.modules.project.dto.task.TaskResponse;
import com.saparbek.task_manager_pro.modules.project.dto.task.WeeklyStats;
import com.saparbek.task_manager_pro.modules.project.model.enums.TaskPriority;
import com.saparbek.task_manager_pro.modules.project.model.enums.TaskStatus;
import com.saparbek.task_manager_pro.modules.project.service.TaskService;
import com.saparbek.task_manager_pro.modules.user.model.User;
import com.saparbek.task_manager_pro.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    // ✅ Create
    @PostMapping
    public ResponseEntity<TaskResponse> create(@RequestBody TaskRequest request, @AuthenticationPrincipal UserDetails user) {
        TaskResponse response = taskService.createTask(request, user.getUsername());

        // 📢 Отправляем уведомление по WebSocket
        messagingTemplate.convertAndSend(
                "/topic/notifications",
                "✅ Задача создана: " + response.getTitle()
        );

        return ResponseEntity.ok(response);
    }


    // ✅ Get tasks by column
    @GetMapping("/column/{columnId}")
    public ResponseEntity<List<TaskResponse>> getTasksByColumn(@PathVariable UUID columnId) {
        return ResponseEntity.ok(taskService.getTasksByColumn(columnId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TaskResponse>> getMyTasks(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(taskService.getTasksByAssignee(currentUser.getId()));
    }

    // ✅ Get task by ID
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    // ✅ Update task by ID
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable UUID id,
                                                   @RequestBody TaskRequest request,
                                                   @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(taskService.updateTask(id, request, user.getUsername()));
    }


    // ✅ Delete task by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id,
                                           @AuthenticationPrincipal UserDetails user) {
        taskService.deleteTask(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }


    // ✅ Filter tasks + overdue
    @GetMapping("/filter")
    public ResponseEntity<Page<TaskResponse>> filterTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) UUID assigneeId,
            @RequestParam(required = false) UUID columnId,
            @RequestParam(required = false) Boolean overdue, // ✅ добавлено
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                taskService.filterTasks(status, priority, assigneeId, columnId, overdue, pageable)
        );
    }

    @PostMapping("/filter")
    public ResponseEntity<List<TaskResponse>> filterTasksPost(
            @RequestBody TaskFilterRequest filterRequest
    ) {
        return ResponseEntity.ok(
                taskService.filterTasksPost(filterRequest)
        );
    }

    @GetMapping("/today")
    public List<TaskResponse> getTodayTasksForUser(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername(); // 👈 это email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return taskService.getTasksForToday(user.getId(), LocalDate.now());
    }

    @GetMapping("/stats/weekly")
    public List<WeeklyStats> getWeeklyStats(@AuthenticationPrincipal UserDetails user) {
        UUID userId = userRepository.findByEmail(user.getUsername())
                .orElseThrow().getId();
        return taskService.getWeeklyStats(userId);
    }


    @GetMapping
    public List<TaskResponse> getAllTasks() {
        return taskService.getAllTasks();
    }


}
