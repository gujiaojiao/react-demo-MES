package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.admin.dto.BomDTO;
import com.example.admin.entity.Bom;
import com.example.admin.mapper.BomMapper;
import com.example.admin.service.BomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BomServiceImpl implements BomService {

    private final BomMapper bomMapper;

    @Override
    public List<Bom> getBomListByProductId(Long productId) {
        LambdaQueryWrapper<Bom> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Bom::getProductId, productId)
                .orderByAsc(Bom::getId);
        return bomMapper.selectList(wrapper);
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
        // 检查是否已存在相同的BOM记录
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
            bom.setProductId(bomDTO.getProductId());
        }

        if (bomDTO.getMaterialId() != null) {
            // 检查是否与其他BOM记录冲突
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
}