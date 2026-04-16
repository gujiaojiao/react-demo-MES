package com.example.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
public class ProductDTO implements Serializable {
    private Long id;

    @NotBlank(message = "产品名称不能为空")
    private String name;

    @NotBlank(message = "产品编码不能为空")
    private String code;

    private String spec;

    private Integer status;

    private String description;
}