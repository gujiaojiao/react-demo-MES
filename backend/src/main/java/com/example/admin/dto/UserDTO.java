package com.example.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
public class UserDTO implements Serializable {
    private Long id;

    @NotBlank(message = "用户名不能为空")
    private String username;

    private String password;

    @Email(message = "邮箱格式不正确")
    private String email;

    private String role;

    private Integer status;
}