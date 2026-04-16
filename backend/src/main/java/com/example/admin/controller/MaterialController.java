package com.example.admin.controller;

import com.example.admin.common.PageResult;
import com.example.admin.common.Result;
import com.example.admin.dto.MaterialDTO;
import com.example.admin.entity.Material;
import com.example.admin.service.MaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/material")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @GetMapping("/list")
    public Result<PageResult<Material>> getMaterialList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type) {
        PageResult<Material> result = materialService.getMaterialList(page, pageSize, keyword, type);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Material> getMaterialById(@PathVariable Long id) {
        Material material = materialService.getMaterialById(id);
        return Result.success(material);
    }

    @PostMapping
    public Result<Material> createMaterial(@Valid @RequestBody MaterialDTO materialDTO) {
        Material material = materialService.createMaterial(materialDTO);
        return Result.success(material, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<Material> updateMaterial(@PathVariable Long id, @RequestBody MaterialDTO materialDTO) {
        Material material = materialService.updateMaterial(id, materialDTO);
        return Result.success(material, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return Result.success(null, "删除成功");
    }
}