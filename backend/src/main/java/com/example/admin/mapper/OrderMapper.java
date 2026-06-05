package com.example.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.dto.ProductionOrderVO;
import com.example.admin.entity.ProductionOrder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface OrderMapper extends BaseMapper<ProductionOrder> {
    @Select("""
        <script>
        SELECT
            o.id AS id,
            o.order_no AS orderNo,
            o.product_id AS productId,
            p.name AS productName,
            p.code AS productCode,
            o.route_id AS routeId,
            r.name AS routeName,
            r.code AS routeCode,
            o.quantity AS quantity,
            o.status AS status,
            o.plan_start_date AS planStartDate,
            o.plan_end_date AS planEndDate,
            o.created_at AS createdAt,
            o.updated_at AS updatedAt
        FROM production_order o
        LEFT JOIN product p ON o.product_id = p.id
        LEFT JOIN route r ON o.route_id = r.id
        <where>
            <if test="keyword != null and keyword != ''">
                o.order_no LIKE CONCAT('%', #{keyword}, '%')
            </if>
            <if test="status != null">
                AND o.status = #{status}
            </if>
        </where>
        ORDER BY o.id ASC
        </script>
    """)
    List<ProductionOrderVO> selectOrderPage(Page<ProductionOrderVO> page,
                                            @Param("keyword") String keyword,
                                            @Param("status") Integer status);

    @Select("""
        SELECT
            o.id AS id,
            o.order_no AS orderNo,
            o.product_id AS productId,
            p.name AS productName,
            p.code AS productCode,
            o.route_id AS routeId,
            r.name AS routeName,
            r.code AS routeCode,
            o.quantity AS quantity,
            o.status AS status,
            o.plan_start_date AS planStartDate,
            o.plan_end_date AS planEndDate,
            o.created_at AS createdAt,
            o.updated_at AS updatedAt
        FROM production_order o
        LEFT JOIN product p ON o.product_id = p.id
        LEFT JOIN route r ON o.route_id = r.id
        WHERE o.id = #{id}
    """)
    ProductionOrderVO selectOrderDetailById(@Param("id") Long id);
}
