package com.example.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.admin.entity.ProductionOrder;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderMapper extends BaseMapper<ProductionOrder> {
}