package com.saparbek.task_manager_pro.modules.user.dto;


import com.saparbek.task_manager_pro.modules.user.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private UUID id;
    private String email;
    private String name;
    private String avatarUrl;
    private Role role;
}
