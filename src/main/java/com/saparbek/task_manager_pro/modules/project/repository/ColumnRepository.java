package com.saparbek.task_manager_pro.modules.project.repository;

import com.saparbek.task_manager_pro.modules.project.model.ColumnEntity;
import com.saparbek.task_manager_pro.modules.project.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ColumnRepository extends JpaRepository<ColumnEntity, UUID> {
    List<ColumnEntity> findAllByBoardId(UUID boardId);
}