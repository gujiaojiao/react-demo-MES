package com.example.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
public class MaterialDTO implements Serializable {
    private Long id;

    @NotBlank(message = "物料名称不能为空")
    private String name;

    @NotBlank(message = "物料编码不能为空")
    private String code;

    @NotBlank(message = "物料类型不能为空")
    private String type;

    private Integer stockQty;

    @NotBlank(message = "计量单位不能为空")
    private String unit;

    private Integer status;
}