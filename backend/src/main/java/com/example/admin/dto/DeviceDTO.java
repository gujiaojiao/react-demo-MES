package com.example.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
public class DeviceDTO implements Serializable {
    private Long id;

    @NotBlank(message = "设备名称不能为空")
    private String name;

    @NotBlank(message = "设备编码不能为空")
    private String code;

    @NotBlank(message = "设备类型不能为空")
    private String type;

    private String location;

    private Integer status;
}