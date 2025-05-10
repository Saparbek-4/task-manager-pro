package com.saparbek.task_manager_pro.modules.project.service;

import com.saparbek.task_manager_pro.modules.activity.model.ActivityEvent;
import com.saparbek.task_manager_pro.modules.activity.service.ActivityLogService;
import com.saparbek.task_manager_pro.modules.project.dto.task.TaskFilterRequest;
import com.saparbek.task_manager_pro.modules.project.dto.task.TaskRequest;
import com.saparbek.task_manager_pro.modules.project.dto.task.TaskResponse;
import com.saparbek.task_manager_pro.modules.project.dto.task.WeeklyStats;
import com.saparbek.task_manager_pro.modules.project.model.Task;
import com.saparbek.task_manager_pro.modules.project.model.enums.TaskPriority;
import com.saparbek.task_manager_pro.modules.project.model.enums.TaskStatus;
import com.saparbek.task_manager_pro.modules.project.repository.TaskRepository;
import com.saparbek.task_manager_pro.modules.project.model.ColumnEntity;
import com.saparbek.task_manager_pro.modules.project.repository.ColumnRepository;
import com.saparbek.task_manager_pro.modules.user.model.User;
import com.saparbek.task_manager_pro.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ColumnRepository columnRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public TaskResponse createTask(TaskRequest request, String creatorUsername) {
        ColumnEntity column = columnRepository.findById(request.getColumnId())
                .orElseThrow(() -> new RuntimeException("Column not found"));

        List<User> assignees = new ArrayList<>();
        if (request.getAssigneeIds() != null) {
            assignees = userRepository.findAllById(request.getAssigneeIds());
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(request.getStatus())
                .deadline(request.getDeadline())
                .createdAt(LocalDateTime.now())
                .column(column)
                .assignees(assignees)
                .build();

        Task saved = taskRepository.save(task);

        activityLogService.logEvent(
                ActivityEvent.TASK_CREATED,
                creatorUsername,
                null,
                saved.getId(),
                column.getBoard().getProject().getId()
        );

        return mapToResponse(saved);
    }

    public List<TaskResponse> getTasksByColumn(UUID columnId) {
        return taskRepository.findAllByColumnId(columnId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return mapToResponse(task);
    }

    public TaskResponse updateTask(UUID id, TaskRequest request, String updaterUsername) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        ColumnEntity oldColumn = task.getColumn();
        ColumnEntity newColumn = columnRepository.findById(request.getColumnId())
                .orElseThrow(() -> new RuntimeException("Column not found"));

        List<User> assignees = new ArrayList<>();
        if (request.getAssigneeIds() != null) {
            assignees = userRepository.findAllById(request.getAssigneeIds());
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDeadline(request.getDeadline());
        task.setColumn(newColumn);
        task.setAssignees(assignees);

        if (request.getStatus() == TaskStatus.DONE && task.getCompletedAt() == null) {
            task.setCompletedAt(LocalDateTime.now());
        } else if (request.getStatus() != TaskStatus.DONE && task.getCompletedAt() != null) {
            task.setCompletedAt(null);
        }


        Task updated = taskRepository.save(task);


        if (!oldColumn.getId().equals(newColumn.getId())) {
            activityLogService.logEvent(
                    ActivityEvent.TASK_MOVED,
                    updaterUsername,
                    null,
                    updated.getId(),
                    newColumn.getBoard().getProject().getId()
            );
        }


        activityLogService.logEvent(
                ActivityEvent.TASK_UPDATED,
                updaterUsername,
                null,
                updated.getId(),
                newColumn.getBoard().getProject().getId()
        );

        return mapToResponse(updated);
    }


    public void deleteTask(UUID id, String deleterUsername) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        activityLogService.logEvent(
                ActivityEvent.TASK_DELETED,
                deleterUsername,
                null,
                task.getId(),
                task.getColumn().getBoard().getProject().getId()
        );

        taskRepository.delete(task);
    }


    public Page<TaskResponse> filterTasks(TaskStatus status, TaskPriority priority, UUID assigneeId,
                                          UUID columnId, Boolean overdue, Pageable pageable) {

        Specification<Task> spec = Specification.where(null);

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        if (priority != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("priority"), priority));
        }

        if (assigneeId != null) {
            spec = spec.and((root, query, cb) -> cb.isMember(assigneeId, root.get("assignees")));
        }

        if (columnId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("column").get("id"), columnId));
        }

        if (overdue != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("overdue"), overdue));
        }

        return taskRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .deadline(task.getDeadline())
                .assigneeIds(task.getAssignees().stream()
                        .map(User::getId)
                        .collect(Collectors.toList()))
                .assigneeUsernames(task.getAssignees().stream()
                        .map(User::getUsername)
                        .collect(Collectors.toList()))
                .columnId(task.getColumn().getId())
                .build();
    }

    public List<TaskResponse> filterTasksPost(TaskFilterRequest filterRequest) {
        Specification<Task> spec = Specification.where(null);

        if (filterRequest.getStatuses() != null && !filterRequest.getStatuses().isEmpty()) {
            spec = spec.and((root, query, cb) -> root.get("status").in(filterRequest.getStatuses()));
        }

        if (filterRequest.getPriorities() != null && !filterRequest.getPriorities().isEmpty()) {
            spec = spec.and((root, query, cb) -> root.get("priority").in(filterRequest.getPriorities()));
        }

        if (filterRequest.getAssigneeId() != null) {
            User assignee = userRepository.findById(filterRequest.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            spec = spec.and((root, query, cb) -> cb.isMember(assignee, root.get("assignees")));
        }

        if (filterRequest.getColumnId() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("column").get("id"), filterRequest.getColumnId()));
        }

        if (Boolean.TRUE.equals(filterRequest.getOverdue())) {
            spec = spec.and((root, query, cb) -> cb.and(
                    cb.lessThan(root.get("deadline"), LocalDate.now()),
                    cb.notEqual(root.get("status"), TaskStatus.DONE)
            ));
        }

        if (filterRequest.getDeadlineBefore() != null) {
            spec = spec.and((root, query, cb) -> cb.lessThan(root.get("deadline"), filterRequest.getDeadlineBefore()));
        }

        if (filterRequest.getDeadlineAfter() != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThan(root.get("deadline"), filterRequest.getDeadlineAfter()));
        }

        Sort sort = Sort.unsorted();
        if (filterRequest.getSortBy() != null) {
            Sort.Direction direction = "DESC".equalsIgnoreCase(filterRequest.getSortDirection())
                    ? Sort.Direction.DESC : Sort.Direction.ASC;
            sort = Sort.by(direction, filterRequest.getSortBy());
        }

        Pageable pageable = PageRequest.of(0,
                filterRequest.getPageSize() != null ? filterRequest.getPageSize() : 100,
                sort);

        return taskRepository.findAll(spec, pageable)
                .map(this::mapToResponse)
                .getContent();
    }


    public List<TaskResponse> getTasksForToday(UUID userId, LocalDate today) {
        List<Task> tasks = taskRepository.findByDeadlineAndAssignee(today, userId);
        return tasks.stream().map(TaskResponse::from).toList();
    }

    public List<WeeklyStats> getWeeklyStats(UUID userId) {
        List<WeeklyStats> stats = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.plusDays(1).atStartOfDay();

            long done = taskRepository.countByStatusAndCompletedAtBetweenAndAssigneeId(
                    TaskStatus.DONE, start, end, userId
            );

            long pending = taskRepository.countByStatusNotAndCreatedAtBeforeAndAssigneeId(
                    TaskStatus.DONE, end, userId
            );

            String dayShort = date.getDayOfWeek()
                    .getDisplayName(TextStyle.SHORT, Locale.forLanguageTag("ru"));

            stats.add(new WeeklyStats(dayShort, done, pending));
        }

        return stats;
    }



    public List<TaskResponse> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return tasks.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksByAssignee(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Task> tasks = taskRepository.findAllByAssigneesContaining(user);

        return tasks.stream().map(this::mapToResponse).toList();
    }

}

