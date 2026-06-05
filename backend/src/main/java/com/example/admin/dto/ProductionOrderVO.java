package com.example.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ProductionOrderVO implements Serializable {
    private Long id;
    private String orderNo;
    private Long productId;
    private String productName;
    private String productCode;
    private Long routeId;
    private String routeName;
    private String routeCode;
    private Integer quantity;
    private Integer status;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate planStartDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate planEndDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
