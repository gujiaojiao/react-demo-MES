package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.admin.dto.BomDTO;
import com.example.admin.dto.BomVO;
import com.example.admin.entity.Bom;
import com.example.admin.entity.Material;
import com.example.admin.entity.Product;
import com.example.admin.mapper.BomMapper;
import com.example.admin.mapper.MaterialMapper;
import com.example.admin.mapper.ProductMapper;
import com.example.admin.service.BomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BomServiceImpl implements BomService {

    private final BomMapper bomMapper;
    private final ProductMapper productMapper;
    private final MaterialMapper materialMapper;

    @Override
    public List<BomVO> getBomListByProductId(Long productId) {
        ensureProductExists(productId);
        return bomMapper.selectBomListByProductId(productId);
    }

    @Override
    public Bom getBomById(Long id) {
        Bom bom = bomMapper.selectById(id);
        if (bom == null) {
            throw new RuntimeException("BOM记录不存在");
        }
        return bom;
    }

    @Override
    public Bom createBom(BomDTO bomDTO) {
        validateProductAndMaterial(bomDTO.getProductId(), bomDTO.getMaterialId());
        validateQuantity(bomDTO.getQuantity());

        Long count = bomMapper.selectCount(
                new LambdaQueryWrapper<Bom>()
                        .eq(Bom::getProductId, bomDTO.getProductId())
                        .eq(Bom::getMaterialId, bomDTO.getMaterialId())
        );
        if (count > 0) {
            throw new RuntimeException("该产品已包含此物料");
        }

        Bom bom = new Bom();
        bom.setProductId(bomDTO.getProductId());
        bom.setMaterialId(bomDTO.getMaterialId());
        bom.setQuantity(bomDTO.getQuantity());
        bom.setCreatedAt(LocalDateTime.now());

        bomMapper.insert(bom);
        return bom;
    }

    @Override
    public Bom updateBom(Long id, BomDTO bomDTO) {
        Bom bom = bomMapper.selectById(id);
        if (bom == null) {
            throw new RuntimeException("BOM记录不存在");
        }

        if (bomDTO.getProductId() != null) {
            ensureProductExists(bomDTO.getProductId());
            bom.setProductId(bomDTO.getProductId());
        }

        if (bomDTO.getMaterialId() != null) {
            ensureMaterialExists(bomDTO.getMaterialId());
            Long count = bomMapper.selectCount(
                    new LambdaQueryWrapper<Bom>()
                            .eq(Bom::getProductId, bom.getProductId())
                            .eq(Bom::getMaterialId, bomDTO.getMaterialId())
                            .ne(Bom::getId, id)
            );
            if (count > 0) {
                throw new RuntimeException("该产品已包含此物料");
            }
            bom.setMaterialId(bomDTO.getMaterialId());
        }

        if (bomDTO.getQuantity() != null) {
            validateQuantity(bomDTO.getQuantity());
            bom.setQuantity(bomDTO.getQuantity());
        }

        bomMapper.updateById(bom);
        return bom;
    }

    @Override
    public void deleteBom(Long id) {
        Bom bom = bomMapper.selectById(id);
        if (bom == null) {
            throw new RuntimeException("BOM记录不存在");
        }
        bomMapper.deleteById(id);
    }

    private void validateProductAndMaterial(Long productId, Long materialId) {
        ensureProductExists(productId);
        ensureMaterialExists(materialId);
    }

    private void ensureProductExists(Long productId) {
        Product product = productMapper.selectById(productId);
        if (product == null) {
            throw new RuntimeException("产品不存在");
        }
    }

    private void ensureMaterialExists(Long materialId) {
        Material material = materialMapper.selectById(materialId);
        if (material == null) {
            throw new RuntimeException("物料不存在");
        }
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("用量必须大于0");
        }
    }
}
