package com.saparbek.task_manager_pro.modules.project.controller;

import com.saparbek.task_manager_pro.modules.project.dto.column.ColumnRequest;
import com.saparbek.task_manager_pro.modules.project.dto.column.ColumnResponse;
import com.saparbek.task_manager_pro.modules.project.service.ColumnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/columns")
@RequiredArgsConstructor
public class ColumnController {

    private final ColumnService columnService;

    @PostMapping
    public ResponseEntity<ColumnResponse> createColumn(@RequestBody ColumnRequest request) {
        return ResponseEntity.ok(columnService.createColumn(request));
    }

    @GetMapping("/by-board/{boardId}")
    public ResponseEntity<List<ColumnResponse>> getColumnsByBoard(@PathVariable UUID boardId) {
        return ResponseEntity.ok(columnService.getColumnsByBoardId(boardId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ColumnResponse> updateColumn(@PathVariable UUID id,
                                                       @RequestBody ColumnRequest request) {
        return ResponseEntity.ok(columnService.updateColumn(id, request.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColumn(@PathVariable UUID id) {
        columnService.deleteColumn(id);
        return ResponseEntity.noContent().build();
    }
}