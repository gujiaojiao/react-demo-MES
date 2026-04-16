package com.example.admin.service;

import com.example.admin.common.PageResult;
import com.example.admin.dto.MaterialDTO;
import com.example.admin.entity.Material;

public interface MaterialService {
    PageResult<Material> getMaterialList(int page, int pageSize, String keyword, String type);
    Material getMaterialById(Long id);
    Material createMaterial(MaterialDTO materialDTO);
    Material updateMaterial(Long id, MaterialDTO materialDTO);
    void deleteMaterial(Long id);
}