package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.common.PageResult;
import com.example.admin.dto.MaterialDTO;
import com.example.admin.entity.Material;
import com.example.admin.mapper.MaterialMapper;
import com.example.admin.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialMapper materialMapper;

    @Override
    public PageResult<Material> getMaterialList(int page, int pageSize, String keyword, String type) {
        LambdaQueryWrapper<Material> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w
                    .like(Material::getName, keyword)
                    .or()
                    .like(Material::getCode, keyword)
            );
        }

        if (StringUtils.hasText(type)) {
            wrapper.eq(Material::getType, type);
        }

        wrapper.orderByAsc(Material::getId);

        Page<Material> pageResult = materialMapper.selectPage(new Page<>(page, pageSize), wrapper);

        return new PageResult<>(pageResult.getRecords(), pageResult.getTotal());
    }

    @Override
    public Material getMaterialById(Long id) {
        Material material = materialMapper.selectById(id);
        if (material == null) {
            throw new RuntimeException("物料不存在");
        }
        return material;
    }

    @Override
    public Material createMaterial(MaterialDTO materialDTO) {
        Long count = materialMapper.selectCount(
                new LambdaQueryWrapper<Material>()
                        .eq(Material::getCode, materialDTO.getCode())
        );
        if (count > 0) {
            throw new RuntimeException("物料编码已存在");
        }

        Material material = new Material();
        material.setName(materialDTO.getName());
        material.setCode(materialDTO.getCode());
        material.setType(materialDTO.getType());
        material.setStockQty(materialDTO.getStockQty() != null ? materialDTO.getStockQty() : 0);
        material.setUnit(materialDTO.getUnit());
        material.setStatus(materialDTO.getStatus() != null ? materialDTO.getStatus() : 1);
        material.setCreatedAt(LocalDateTime.now());

        materialMapper.insert(material);

        return material;
    }

    @Override
    public Material updateMaterial(Long id, MaterialDTO materialDTO) {
        Material material = materialMapper.selectById(id);
        if (material == null) {
            throw new RuntimeException("物料不存在");
        }

        if (StringUtils.hasText(materialDTO.getName())) {
            material.setName(materialDTO.getName());
        }

        if (StringUtils.hasText(materialDTO.getCode())) {
            Long count = materialMapper.selectCount(
                    new LambdaQueryWrapper<Material>()
                            .eq(Material::getCode, materialDTO.getCode())
                            .ne(Material::getId, id)
            );
            if (count > 0) {
                throw new RuntimeException("物料编码已存在");
            }
            material.setCode(materialDTO.getCode());
        }

        if (StringUtils.hasText(materialDTO.getType())) {
            material.setType(materialDTO.getType());
        }

        if (materialDTO.getStockQty() != null) {
            material.setStockQty(materialDTO.getStockQty());
        }

        if (StringUtils.hasText(materialDTO.getUnit())) {
            material.setUnit(materialDTO.getUnit());
        }

        if (materialDTO.getStatus() != null) {
            material.setStatus(materialDTO.getStatus());
        }

        materialMapper.updateById(material);

        return material;
    }

    @Override
    public void deleteMaterial(Long id) {
        Material material = materialMapper.selectById(id);
        if (material == null) {
            throw new RuntimeException("物料不存在");
        }
        materialMapper.deleteById(id);
    }
}