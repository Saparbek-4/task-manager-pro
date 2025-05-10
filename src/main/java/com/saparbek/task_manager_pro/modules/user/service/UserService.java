package com.saparbek.task_manager_pro.modules.user.service;

import com.saparbek.task_manager_pro.modules.user.dto.UpdateUserRequest;
import com.saparbek.task_manager_pro.modules.user.security.CustomUserDetails;
import com.saparbek.task_manager_pro.modules.user.model.User;
import com.saparbek.task_manager_pro.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void updateUser(UUID userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getOldPassword() == null || !passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Старый пароль неверен");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);
    }


    public void updateAvatar(UUID userId, MultipartFile file) {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads", "avatars");
        Path path = uploadDir.resolve(filename);

        try {
            Files.createDirectories(uploadDir);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            User user = userRepository.findById(userId).orElseThrow();
            user.setAvatarUrl("/uploads/avatars/" + filename); // для фронта
            userRepository.save(user);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при загрузке файла", e);
        }
    }

}

