package com.saparbek.task_manager_pro.modules.project.controller;

import com.saparbek.task_manager_pro.modules.project.dto.board.BoardRequest;
import com.saparbek.task_manager_pro.modules.project.dto.board.BoardResponse;
import com.saparbek.task_manager_pro.modules.project.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping
    public ResponseEntity<BoardResponse> createBoard(@RequestBody BoardRequest request) {
        return ResponseEntity.ok(boardService.createBoard(request));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<BoardResponse>> getBoards(@PathVariable UUID projectId) {
        return ResponseEntity.ok(boardService.getBoardsByProjectId(projectId));
    }
}

