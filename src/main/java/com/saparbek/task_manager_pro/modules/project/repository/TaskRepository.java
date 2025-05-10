package com.saparbek.task_manager_pro.modules.project.repository;

import com.saparbek.task_manager_pro.modules.project.model.Project;
import com.saparbek.task_manager_pro.modules.project.model.Task;
import com.saparbek.task_manager_pro.modules.project.model.enums.TaskStatus;
import com.saparbek.task_manager_pro.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID>, JpaSpecificationExecutor<Task> {
    List<Task> findAllByColumnId(UUID columnId);
    List<Task> findAllByDeadlineBeforeAndStatusNot(LocalDate deadline, TaskStatus status);
    List<Task> findAllByDeadlineAndStatusNot(LocalDate deadline, TaskStatus status);
    int countByColumnBoardProject(Project project);

    @Query("SELECT t FROM Task t JOIN t.assignees a WHERE t.deadline = :today AND a.id = :userId")
    List<Task> findByDeadlineAndAssignee(@Param("today") LocalDate today, @Param("userId") UUID userId);

    List<Task> findAllByAssigneesContaining(User user);

    @Query("""
    SELECT COUNT(t)
    FROM Task t
    JOIN t.assignees a
    WHERE t.status = :status
      AND t.completedAt BETWEEN :start AND :end
      AND a.id = :userId
""")
    long countByStatusAndCompletedAtBetweenAndAssigneeId(
            @Param("status") TaskStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("userId") UUID userId
    );

    @Query("""
    SELECT COUNT(t)
    FROM Task t
    JOIN t.assignees a
    WHERE t.status <> :status
      AND t.createdAt < :before
      AND a.id = :userId
""")
    long countByStatusNotAndCreatedAtBeforeAndAssigneeId(
            @Param("status") TaskStatus status,
            @Param("before") LocalDateTime before,
            @Param("userId") UUID userId
    );
}
