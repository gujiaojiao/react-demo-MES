package com.example.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.admin.dto.RouteVO;
import com.example.admin.entity.RouteProcess;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface RouteProcessMapper extends BaseMapper<RouteProcess> {
    @Select("""
        SELECT
            rp.process_id AS processId,
            p.name AS processName,
            p.code AS processCode,
            rp.sequence AS sequence
        FROM route_process rp
        LEFT JOIN mes_process p ON rp.process_id = p.id
        WHERE rp.route_id = #{routeId}
        ORDER BY rp.sequence ASC, rp.id ASC
    """)
    List<RouteVO.RouteProcessVO> selectProcessDetailsByRouteId(@Param("routeId") Long routeId);
}
