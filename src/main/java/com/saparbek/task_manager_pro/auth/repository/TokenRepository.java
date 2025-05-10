package com.saparbek.task_manager_pro.auth.repository;

import com.saparbek.task_manager_pro.auth.model.Token;
import com.saparbek.task_manager_pro.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TokenRepository extends JpaRepository<Token, UUID> {
    List<Token> findAllByUser(User user);
    Optional<Token> findByToken(String token);
}
