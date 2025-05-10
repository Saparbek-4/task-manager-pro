package com.saparbek.task_manager_pro.auth.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}

