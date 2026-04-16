package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.common.PageResult;
import com.example.admin.dto.DictDTO;
import com.example.admin.dto.DictTypeVO;
import com.example.admin.entity.Dict;
import com.example.admin.mapper.DictMapper;
import com.example.admin.service.DictService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DictServiceImpl implements DictService {

    private final DictMapper dictMapper;

    @Override
    public PageResult<Dict> getDictList(int page, int pageSize, String dictType) {
        LambdaQueryWrapper<Dict> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(dictType)) {
            wrapper.eq(Dict::getDictType, dictType);
        }

        wrapper.orderByAsc(Dict::getDictType).orderByAsc(Dict::getSort);

        Page<Dict> pageResult = dictMapper.selectPage(new Page<>(page, pageSize), wrapper);

        return new PageResult<>(pageResult.getRecords(), pageResult.getTotal());
    }

    @Override
    public List<DictTypeVO> getAllDictTypes() {
        // 查询所有字典数据
        List<Dict> allDicts = dictMapper.selectList(null);

        // 按类型分组，统计每个类型的字典项数量
        Map<String, Integer> typeCountMap = allDicts.stream()
                .collect(Collectors.groupingBy(Dict::getDictType, Collectors.summingInt(d -> 1)));

        // 转换为 DictTypeVO 列表
        List<DictTypeVO> result = new ArrayList<>();
        typeCountMap.forEach((type, count) -> {
            DictTypeVO vo = new DictTypeVO();
            vo.setDictType(type);
            vo.setItemCount(count);
            result.add(vo);
        });

        return result;
    }

    @Override
    public List<Dict> getDictByType(String dictType) {
        LambdaQueryWrapper<Dict> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Dict::getDictType, dictType)
                .orderByAsc(Dict::getSort);
        return dictMapper.selectList(wrapper);
    }

    @Override
    public Dict getDictById(Long id) {
        Dict dict = dictMapper.selectById(id);
        if (dict == null) {
            throw new RuntimeException("字典项不存在");
        }
        return dict;
    }

    @Override
    public Dict createDict(DictDTO dictDTO) {
        Dict dict = new Dict();
        dict.setDictType(dictDTO.getDictType());
        dict.setDictCode(dictDTO.getDictCode());
        dict.setDictLabel(dictDTO.getDictLabel());
        dict.setSort(dictDTO.getSort() != null ? dictDTO.getSort() : 0);
        dict.setStatus(dictDTO.getStatus() != null ? dictDTO.getStatus() : 1);
        dict.setCreatedAt(LocalDateTime.now());

        dictMapper.insert(dict);
        return dict;
    }

    @Override
    public Dict updateDict(Long id, DictDTO dictDTO) {
        Dict dict = dictMapper.selectById(id);
        if (dict == null) {
            throw new RuntimeException("字典项不存在");
        }

        if (StringUtils.hasText(dictDTO.getDictType())) {
            dict.setDictType(dictDTO.getDictType());
        }
        if (StringUtils.hasText(dictDTO.getDictCode())) {
            dict.setDictCode(dictDTO.getDictCode());
        }
        if (StringUtils.hasText(dictDTO.getDictLabel())) {
            dict.setDictLabel(dictDTO.getDictLabel());
        }
        if (dictDTO.getSort() != null) {
            dict.setSort(dictDTO.getSort());
        }
        if (dictDTO.getStatus() != null) {
            dict.setStatus(dictDTO.getStatus());
        }

        dictMapper.updateById(dict);
        return dict;
    }

    @Override
    public void deleteDict(Long id) {
        Dict dict = dictMapper.selectById(id);
        if (dict == null) {
            throw new RuntimeException("字典项不存在");
        }
        dictMapper.deleteById(id);
    }
}