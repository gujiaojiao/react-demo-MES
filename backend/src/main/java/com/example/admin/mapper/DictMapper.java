package com.example.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.admin.entity.Dict;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DictMapper extends BaseMapper<Dict> {
    List<Dict> selectByDictType(String dictType);
}