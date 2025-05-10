package com.saparbek.task_manager_pro.modules.project.service;

import com.saparbek.task_manager_pro.modules.notification.service.MailService;
import com.saparbek.task_manager_pro.modules.notification.service.NotificationService;
import com.saparbek.task_manager_pro.modules.project.model.Task;
import com.saparbek.task_manager_pro.modules.project.model.enums.TaskStatus;
import com.saparbek.task_manager_pro.modules.project.repository.TaskRepository;
import com.saparbek.task_manager_pro.modules.user.model.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduledTaskCheckerService {

    private final TaskRepository taskRepository;
    private final MailService mailService;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void checkOverdueTasks() {
        List<Task> overdueTasks = taskRepository.findAllByDeadlineBeforeAndStatusNot(
                LocalDate.now(), TaskStatus.DONE
        );

        for (Task task : overdueTasks) {
            if (!task.isOverdue()) {
                task.setOverdue(true);
                mailService.sendOverdueNotification(task);

                for (User assignee : task.getAssignees()) {
                    notificationService.notifyUser(
                            assignee,
                            "⏰ Просроченная задача",
                            task.getTitle()
                    );
                }
            }
        }

        taskRepository.saveAll(overdueTasks);
    }

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void notifyTodayDeadlines() {
        List<Task> todayDeadlineTasks = taskRepository.findAllByDeadlineAndStatusNot(
                LocalDate.now(), TaskStatus.DONE
        );

        for (Task task : todayDeadlineTasks) {
            mailService.sendUpcomingDeadlineNotification(task);

            for (User assignee : task.getAssignees()) {
                notificationService.notifyUser(
                        assignee,
                        "📅 Сегодня дедлайн",
                        task.getTitle()
                );
            }
        }
    }

}
