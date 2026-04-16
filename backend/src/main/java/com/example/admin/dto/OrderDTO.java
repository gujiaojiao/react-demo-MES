package com.example.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;

@Data
public class OrderDTO implements Serializable {
    private Long id;

    private String orderNo;

    @NotNull(message = "产品ID不能为空")
    private Long productId;

    @NotNull(message = "工艺路线ID不能为空")
    private Long routeId;

    @NotNull(message = "生产数量不能为空")
    private Integer quantity;

    private Integer status;

    private LocalDate planStartDate;

    private LocalDate planEndDate;
}