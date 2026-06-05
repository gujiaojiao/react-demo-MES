package com.example.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class BomVO implements Serializable {
    private Long id;
    private Long productId;
    private Long materialId;
    private String materialName;
    private String materialCode;
    private String materialType;
    private String unit;
    private Integer quantity;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}
