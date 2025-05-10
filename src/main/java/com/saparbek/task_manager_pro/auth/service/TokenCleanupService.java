package com.saparbek.task_manager_pro.auth.service;

import com.saparbek.task_manager_pro.auth.model.Token;
import com.saparbek.task_manager_pro.auth.repository.TokenRepository;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TokenCleanupService {

    private final TokenRepository tokenRepository;
    private final JwtService jwtService;

    /**
     * Удаляет просроченные токены каждые 6 часов.
     */
    @Scheduled(cron = "0 0 */6 * * *") // раз в 6 часов или вручную
    public void removeExpiredTokens() {
        List<Token> tokens = tokenRepository.findAll();
        int removedCount = 0;

        for (Token token : tokens) {
            try {
                if (jwtService.isTokenExpired(token.getToken())) {
                    tokenRepository.delete(token);
                    removedCount++;
                }
            } catch (ExpiredJwtException e) {
                tokenRepository.delete(token);
                removedCount++;
            } catch (Exception e) {
            }
        }

        if (removedCount > 0) {
        }
    }

}