package com.example.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class RouteVO implements Serializable {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Integer status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    private List<RouteProcessVO> processes;

    @Data
    public static class RouteProcessVO implements Serializable {
        private Long processId;
        private String processName;
        private String processCode;
        private Integer sequence;
    }
}
