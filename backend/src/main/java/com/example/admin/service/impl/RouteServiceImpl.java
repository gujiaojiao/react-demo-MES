package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.common.PageResult;
import com.example.admin.dto.RouteDTO;
import com.example.admin.entity.Route;
import com.example.admin.entity.RouteProcess;
import com.example.admin.mapper.RouteMapper;
import com.example.admin.mapper.RouteProcessMapper;
import com.example.admin.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

    private final RouteMapper routeMapper;
    private final RouteProcessMapper routeProcessMapper;

    @Override
    public PageResult<Route> getRouteList(int page, int pageSize, String keyword) {
        LambdaQueryWrapper<Route> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w
                    .like(Route::getName, keyword)
                    .or()
                    .like(Route::getCode, keyword)
            );
        }

        wrapper.orderByAsc(Route::getId);

        Page<Route> pageResult = routeMapper.selectPage(new Page<>(page, pageSize), wrapper);

        return new PageResult<>(pageResult.getRecords(), pageResult.getTotal());
    }

    @Override
    public Route getRouteById(Long id) {
        Route route = routeMapper.selectById(id);
        if (route == null) {
            throw new RuntimeException("工艺路线不存在");
        }
        return route;
    }

    @Override
    public Route getRouteWithProcesses(Long id) {
        Route route = getRouteById(id);
        // 获取路线的工序列表
        List<RouteProcess> processes = routeProcessMapper.selectList(
                new LambdaQueryWrapper<RouteProcess>()
                        .eq(RouteProcess::getRouteId, id)
                        .orderByAsc(RouteProcess::getSequence)
        );
        // 将工序列表存入route（需要在Route实体中添加transient字段或使用VO）
        return route;
    }

    @Override
    @Transactional
    public Route createRoute(RouteDTO routeDTO) {
        Long count = routeMapper.selectCount(
                new LambdaQueryWrapper<Route>()
                        .eq(Route::getCode, routeDTO.getCode())
        );
        if (count > 0) {
            throw new RuntimeException("路线编码已存在");
        }

        Route route = new Route();
        route.setName(routeDTO.getName());
        route.setCode(routeDTO.getCode());
        route.setDescription(routeDTO.getDescription());
        route.setStatus(routeDTO.getStatus() != null ? routeDTO.getStatus() : 1);
        route.setCreatedAt(LocalDateTime.now());

        routeMapper.insert(route);

        // 创建工序关联
        if (routeDTO.getProcesses() != null && !routeDTO.getProcesses().isEmpty()) {
            for (RouteDTO.RouteProcessItem item : routeDTO.getProcesses()) {
                RouteProcess routeProcess = new RouteProcess();
                routeProcess.setRouteId(route.getId());
                routeProcess.setProcessId(item.getProcessId());
                routeProcess.setSequence(item.getSequence());
                routeProcess.setCreatedAt(LocalDateTime.now());
                routeProcessMapper.insert(routeProcess);
            }
        }

        return route;
    }

    @Override
    @Transactional
    public Route updateRoute(Long id, RouteDTO routeDTO) {
        Route route = routeMapper.selectById(id);
        if (route == null) {
            throw new RuntimeException("工艺路线不存在");
        }

        if (StringUtils.hasText(routeDTO.getName())) {
            route.setName(routeDTO.getName());
        }

        if (StringUtils.hasText(routeDTO.getCode())) {
            Long count = routeMapper.selectCount(
                    new LambdaQueryWrapper<Route>()
                            .eq(Route::getCode, routeDTO.getCode())
                            .ne(Route::getId, id)
            );
            if (count > 0) {
                throw new RuntimeException("路线编码已存在");
            }
            route.setCode(routeDTO.getCode());
        }

        if (routeDTO.getDescription() != null) {
            route.setDescription(routeDTO.getDescription());
        }

        if (routeDTO.getStatus() != null) {
            route.setStatus(routeDTO.getStatus());
        }

        routeMapper.updateById(route);

        // 更新工序关联：先删除旧的，再插入新的
        if (routeDTO.getProcesses() != null) {
            routeProcessMapper.delete(
                    new LambdaQueryWrapper<RouteProcess>()
                            .eq(RouteProcess::getRouteId, id)
            );

            for (RouteDTO.RouteProcessItem item : routeDTO.getProcesses()) {
                RouteProcess routeProcess = new RouteProcess();
                routeProcess.setRouteId(id);
                routeProcess.setProcessId(item.getProcessId());
                routeProcess.setSequence(item.getSequence());
                routeProcess.setCreatedAt(LocalDateTime.now());
                routeProcessMapper.insert(routeProcess);
            }
        }

        return route;
    }

    @Override
    @Transactional
    public void deleteRoute(Long id) {
        Route route = routeMapper.selectById(id);
        if (route == null) {
            throw new RuntimeException("工艺路线不存在");
        }

        // 删除工序关联
        routeProcessMapper.delete(
                new LambdaQueryWrapper<RouteProcess>()
                        .eq(RouteProcess::getRouteId, id)
        );

        routeMapper.deleteById(id);
    }
}