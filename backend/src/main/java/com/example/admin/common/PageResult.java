package com.example.admin.common;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class PageResult<T> implements Serializable {
    private List<T> list;
    private long total;

    public PageResult() {}

    public PageResult(List<T> list, long total) {
        this.list = list;
        this.total = total;
    }
}