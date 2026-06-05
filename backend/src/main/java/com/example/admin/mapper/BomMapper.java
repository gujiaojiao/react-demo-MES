package com.example.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.admin.dto.BomVO;
import com.example.admin.entity.Bom;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BomMapper extends BaseMapper<Bom> {
    @Select("""
        SELECT
            b.id,
            b.product_id AS productId,
            b.material_id AS materialId,
            m.name AS materialName,
            m.code AS materialCode,
            m.type AS materialType,
            m.unit AS unit,
            b.quantity,
            b.created_at AS createdAt
        FROM bom b
        LEFT JOIN material m ON b.material_id = m.id
        WHERE b.product_id = #{productId}
        ORDER BY b.id ASC
    """)
    List<BomVO> selectBomListByProductId(@Param("productId") Long productId);
}
