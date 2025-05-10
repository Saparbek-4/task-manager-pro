package com.saparbek.task_manager_pro.modules.project.service;

import com.saparbek.task_manager_pro.modules.project.dto.board.BoardRequest;
import com.saparbek.task_manager_pro.modules.project.dto.board.BoardResponse;
import com.saparbek.task_manager_pro.modules.project.model.Board;
import com.saparbek.task_manager_pro.modules.project.model.ColumnEntity;
import com.saparbek.task_manager_pro.modules.project.model.Project;
import com.saparbek.task_manager_pro.modules.project.repository.BoardRepository;
import com.saparbek.task_manager_pro.modules.project.repository.ColumnRepository;
import com.saparbek.task_manager_pro.modules.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final ProjectRepository projectRepository;
    private final ColumnRepository columnRepository;

    public List<BoardResponse> getBoardsByProjectId(UUID projectId) {
        return boardRepository.findAllByProjectId(projectId)
                .stream()
                .map(board -> BoardResponse.builder()
                        .id(board.getId())
                        .name(board.getName())
                        .projectId(board.getProject().getId())
                        .createdAt(board.getCreatedAt())
                        .build()
                ).collect(Collectors.toList());
    }


    public BoardResponse createBoard(BoardRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Board board = Board.builder()
                .name(request.getName())
                .project(project)
                .build();

        Board savedBoard = boardRepository.save(board);
        List<String> defaultColumns = List.of("To Do", "In Progress", "Done");

        for (String name : defaultColumns) {
            ColumnEntity column = ColumnEntity.builder()
                    .name(name)
                    .board(savedBoard)
                    .build();
            columnRepository.save(column);
        }

        return BoardResponse.builder()
                .id(savedBoard.getId())
                .name(savedBoard.getName())
                .projectId(project.getId())
                .createdAt(savedBoard.getCreatedAt())
                .build();
    }
}

