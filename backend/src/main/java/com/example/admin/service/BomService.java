package com.example.admin.service;

import com.example.admin.dto.BomDTO;
import com.example.admin.entity.Bom;

import java.util.List;

public interface BomService {
    List<Bom> getBomListByProductId(Long productId);
    Bom getBomById(Long id);
    Bom createBom(BomDTO bomDTO);
    Bom updateBom(Long id, BomDTO bomDTO);
    void deleteBom(Long id);
}