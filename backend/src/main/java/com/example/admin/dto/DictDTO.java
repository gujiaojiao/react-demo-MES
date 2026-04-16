package com.example.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
public class DictDTO implements Serializable {
    private Long id;

    @NotBlank(message = "字典类型不能为空")
    private String dictType;

    @NotBlank(message = "字典编码不能为空")
    private String dictCode;

    @NotBlank(message = "字典标签不能为空")
    private String dictLabel;

    private Integer sort;

    private Integer status;
}