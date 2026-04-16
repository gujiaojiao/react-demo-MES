package com.example.admin.service;

import com.example.admin.common.PageResult;
import com.example.admin.dto.DictDTO;
import com.example.admin.dto.DictTypeVO;
import com.example.admin.entity.Dict;

import java.util.List;

public interface DictService {
    PageResult<Dict> getDictList(int page, int pageSize, String dictType);
    List<DictTypeVO> getAllDictTypes();
    List<Dict> getDictByType(String dictType);
    Dict getDictById(Long id);
    Dict createDict(DictDTO dictDTO);
    Dict updateDict(Long id, DictDTO dictDTO);
    void deleteDict(Long id);
}