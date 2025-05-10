package com.saparbek.task_manager_pro.modules.user.controller;

import com.saparbek.task_manager_pro.modules.user.security.CustomUserDetails;
import com.saparbek.task_manager_pro.modules.user.dto.UpdateUserRequest;
import com.saparbek.task_manager_pro.modules.user.dto.UserResponse;
import com.saparbek.task_manager_pro.modules.user.model.User;
import com.saparbek.task_manager_pro.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateUserRequest request) {

        userService.updateUser(userDetails.getUser().getId(), request);
        return ResponseEntity.ok("Профиль обновлён");
    }

    @PostMapping("/avatar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadAvatar(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam MultipartFile file) {

        userService.updateAvatar(userDetails.getUser().getId(), file);
        return ResponseEntity.ok("Аватар обновлён");
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        User user = userDetails.getUser();
        UserResponse response = new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getAvatarUrl(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }


}

