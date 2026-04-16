package com.example.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
public class RoleDTO implements Serializable {
    private Long id;

    @NotBlank(message = "角色名称不能为空")
    private String name;

    @NotBlank(message = "角色编码不能为空")
    private String code;

    private Integer status;

    private String description;

    private String permissions;
}