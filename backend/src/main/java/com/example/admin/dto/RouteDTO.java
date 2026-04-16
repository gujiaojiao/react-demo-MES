package com.example.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class RouteDTO implements Serializable {
    private Long id;

    @NotBlank(message = "路线名称不能为空")
    private String name;

    @NotBlank(message = "路线编码不能为空")
    private String code;

    private String description;

    private Integer status;

    // 工序列表：每个元素包含 processId 和 sequence
    private List<RouteProcessItem> processes;

    @Data
    public static class RouteProcessItem implements Serializable {
        private Long processId;
        private Integer sequence;
    }
}