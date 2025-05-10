package com.saparbek.task_manager_pro.modules.user.dto;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class UpdateUserRequest {
    private String oldPassword;
    private String newPassword;
}
