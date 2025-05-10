package com.saparbek.task_manager_pro.modules.project.service;

import com.saparbek.task_manager_pro.modules.activity.model.ActivityEvent;
import com.saparbek.task_manager_pro.modules.activity.service.ActivityLogService;
import com.saparbek.task_manager_pro.modules.project.dto.column.ColumnRequest;
import com.saparbek.task_manager_pro.modules.project.dto.column.ColumnResponse;
import com.saparbek.task_manager_pro.modules.project.model.Board;
import com.saparbek.task_manager_pro.modules.project.model.ColumnEntity;
import com.saparbek.task_manager_pro.modules.project.repository.BoardRepository;
import com.saparbek.task_manager_pro.modules.project.repository.ColumnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ColumnService {

    private final ColumnRepository columnRepository;
    private final BoardRepository boardRepository;
    private final ActivityLogService activityLogService;

    public ColumnResponse createColumn(ColumnRequest request) {
        Board board = boardRepository.findById(request.getBoardId())
                .orElseThrow(() -> new RuntimeException("Board not found"));

        ColumnEntity column = ColumnEntity.builder()
                .name(request.getName())
                .board(board)
                .build();

        ColumnEntity saved = columnRepository.save(column);

        // 🟢 Логируем создание колонки
        activityLogService.logEvent(
                ActivityEvent.COLUMN_CREATED,
                getCurrentUserEmail(),
                null,
                null,
                board.getProject().getId()
        );

        return ColumnResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .boardId(board.getId())
                .build();
    }

    public List<ColumnResponse> getColumnsByBoardId(UUID boardId) {
        return columnRepository.findAllByBoardId(boardId)
                .stream()
                .map(column -> ColumnResponse.builder()
                        .id(column.getId())
                        .name(column.getName())
                        .boardId(column.getBoard().getId())
                        .build())
                .collect(Collectors.toList());
    }

    public ColumnResponse updateColumn(UUID id, String name) {
        ColumnEntity column = columnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Column not found"));

        column.setName(name);
        ColumnEntity updated = columnRepository.save(column);

        activityLogService.logEvent(
                ActivityEvent.COLUMN_UPDATED,
                getCurrentUserEmail(),
                null,
                null,
                column.getBoard().getProject().getId()
        );

        return ColumnResponse.builder()
                .id(updated.getId())
                .name(updated.getName())
                .boardId(updated.getBoard().getId())
                .build();
    }

    public void deleteColumn(UUID id) {
        ColumnEntity column = columnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Column not found"));
        columnRepository.deleteById(id);
        // 🛑 Логируем удаление колонки
        activityLogService.logEvent(
                ActivityEvent.COLUMN_DELETED,
                getCurrentUserEmail(),
                null,
                null,
                column.getBoard().getProject().getId()
        );
    }

    public void createDefaultColumns(Board board) {
        createColumn(new ColumnRequest(board.getId(), "To Do"));
        createColumn(new ColumnRequest(board.getId(), "In Progress"));
        createColumn(new ColumnRequest(board.getId(), "Done"));
    }

    // 👤 Получить текущего пользователя из SecurityContext
    private String getCurrentUserEmail() {
        return org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }
}