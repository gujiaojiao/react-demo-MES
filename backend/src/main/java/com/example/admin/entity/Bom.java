package com.example.admin.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("bom")
public class Bom implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long productId;

    private Long materialId;

    private Integer quantity;

    @TableField("created_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}