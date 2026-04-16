package com.example.admin.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class BomDTO implements Serializable {
    private Long id;

    @NotNull(message = "产品ID不能为空")
    private Long productId;

    @NotNull(message = "物料ID不能为空")
    private Long materialId;

    @NotNull(message = "用量不能为空")
    private Integer quantity;
}