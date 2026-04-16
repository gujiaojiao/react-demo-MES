package com.example.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
public class ProcessDTO implements Serializable {
    private Long id;

    @NotBlank(message = "工序名称不能为空")
    private String name;

    @NotBlank(message = "工序编码不能为空")
    private String code;

    private String description;

    private Integer status;
}