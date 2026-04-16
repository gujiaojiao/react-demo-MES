package com.example.admin.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("production_order")
public class ProductionOrder implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String orderNo;

    private Long productId;

    private Long routeId;

    private Integer quantity;

    private Integer status;

    private LocalDate planStartDate;

    private LocalDate planEndDate;

    @TableField("created_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}