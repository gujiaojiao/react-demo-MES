package com.example.admin.controller;

import com.example.admin.common.PageResult;
import com.example.admin.common.Result;
import com.example.admin.dto.DictDTO;
import com.example.admin.dto.DictTypeVO;
import com.example.admin.entity.Dict;
import com.example.admin.service.DictService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dict")
@RequiredArgsConstructor
public class DictController {

    private final DictService dictService;

    @GetMapping("/types")
    public Result<List<DictTypeVO>> getAllDictTypes() {
        List<DictTypeVO> list = dictService.getAllDictTypes();
        return Result.success(list);
    }

    @GetMapping("/type/{dictType}")
    public Result<List<Dict>> getDictByType(@PathVariable String dictType) {
        List<Dict> list = dictService.getDictByType(dictType);
        return Result.success(list);
    }

    @GetMapping("/{id}")
    public Result<Dict> getDictById(@PathVariable Long id) {
        Dict dict = dictService.getDictById(id);
        return Result.success(dict);
    }

    @PostMapping
    public Result<Dict> createDict(@Valid @RequestBody DictDTO dictDTO) {
        Dict dict = dictService.createDict(dictDTO);
        return Result.success(dict, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<Dict> updateDict(@PathVariable Long id, @Valid @RequestBody DictDTO dictDTO) {
        Dict dict = dictService.updateDict(id, dictDTO);
        return Result.success(dict, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteDict(@PathVariable Long id) {
        dictService.deleteDict(id);
        return Result.success(null, "删除成功");
    }
}