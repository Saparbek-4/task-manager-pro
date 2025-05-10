package com.saparbek.task_manager_pro.modules.notification.service;

import com.saparbek.task_manager_pro.modules.project.model.Task;
import com.saparbek.task_manager_pro.modules.user.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    public void sendOverdueNotification(Task task) {
        if (task.getAssignees() != null && !task.getAssignees().isEmpty()) {
            for (User assignee : task.getAssignees()) {
                String to = assignee.getEmail();
                String subject = "⏰ Просроченная задача: " + task.getTitle();

                String content = """
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa;">
                    <h2 style="color: #dc3545;">⏰ Задача просрочена</h2>
                    <p><strong>Задача:</strong> %s</p>
                    <p><strong>Дедлайн:</strong> %s</p>
                    <p><strong>Проект:</strong> %s</p>
                    <p>Пожалуйста, обновите статус задачи или свяжитесь с администратором.</p>
                    <hr>
                    <p style="font-size: 12px; color: #6c757d;">Это автоматическое уведомление. Платформа Task Manager PRO.</p>
                </body>
                </html>
                """.formatted(
                        task.getTitle(),
                        task.getDeadline().toString(),
                        task.getColumn()
                                .getBoard()
                                .getProject()
                                .getName()
                );

                try {
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");

                    helper.setTo(to);
                    helper.setSubject(subject);
                    helper.setText(content, true); // true = HTML

                    mailSender.send(message);
                } catch (MessagingException e) {
                    e.printStackTrace(); // можно заменить логом
                }
            }
        }
    }

    public void sendUpcomingDeadlineNotification(Task task) {
        String subject = "📅 Сегодня дедлайн задачи: " + task.getTitle();
        if (task.getAssignees() != null && !task.getAssignees().isEmpty()) {
            for (User assignee : task.getAssignees()) {
                String to = assignee.getEmail();
                String content = """
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa;">
                <h2 style="color: #ffc107;">📅 Приближается дедлайн</h2>
                <p><strong>Задача:</strong> %s</p>
                <p><strong>Дедлайн:</strong> %s</p>
                <p><strong>Проект:</strong> %s</p>
                <p>Пожалуйста, выполните задачу до конца дня.</p>
                <hr>
                <p style="font-size: 12px; color: #6c757d;">Это автоматическое уведомление. Платформа Task Manager PRO.</p>
            </body>
            </html>
            """.formatted(
                        task.getTitle(),
                        task.getDeadline().toString(),
                        task.getColumn()
                                .getBoard()
                                .getProject()
                                .getName()
                );

                try {
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");

                    helper.setTo(to);
                    helper.setSubject(subject);
                    helper.setText(content, true);

                    mailSender.send(message);
                } catch (MessagingException e) {
                    e.printStackTrace(); // Или лог
                }
            }
        }
    }

}
