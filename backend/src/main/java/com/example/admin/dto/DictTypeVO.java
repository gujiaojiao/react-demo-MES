package com.example.admin.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class DictTypeVO implements Serializable {
    private String dictType;
    private Integer itemCount;
}