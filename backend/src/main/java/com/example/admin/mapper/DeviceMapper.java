package com.example.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.admin.entity.Device;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DeviceMapper extends BaseMapper<Device> {
}