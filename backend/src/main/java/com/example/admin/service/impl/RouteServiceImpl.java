package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.common.PageResult;
import com.example.admin.dto.RouteDTO;
import com.example.admin.dto.RouteVO;
import com.example.admin.entity.MesProcess;
import com.example.admin.entity.Route;
import com.example.admin.entity.RouteProcess;
import com.example.admin.mapper.ProcessMapper;
import com.example.admin.mapper.RouteMapper;
import com.example.admin.mapper.RouteProcessMapper;
import com.example.admin.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

    private final RouteMapper routeMapper;
    private final RouteProcessMapper routeProcessMapper;
    private final ProcessMapper processMapper;

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
    public RouteVO getRouteWithProcesses(Long id) {
        Route route = getRouteById(id);
        RouteVO routeVO = new RouteVO();
        BeanUtils.copyProperties(route, routeVO);
        routeVO.setProcesses(routeProcessMapper.selectProcessDetailsByRouteId(id));
        return routeVO;
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

        validateProcesses(routeDTO);

        Route route = new Route();
        route.setName(routeDTO.getName());
        route.setCode(routeDTO.getCode());
        route.setDescription(routeDTO.getDescription());
        route.setStatus(routeDTO.getStatus() != null ? routeDTO.getStatus() : 1);
        route.setCreatedAt(LocalDateTime.now());

        routeMapper.insert(route);

        saveRouteProcesses(route.getId(), routeDTO);

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

        if (routeDTO.getProcesses() != null) {
            validateProcesses(routeDTO);
            routeProcessMapper.delete(
                    new LambdaQueryWrapper<RouteProcess>()
                            .eq(RouteProcess::getRouteId, id)
            );
            saveRouteProcesses(id, routeDTO);
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

        routeProcessMapper.delete(
                new LambdaQueryWrapper<RouteProcess>()
                        .eq(RouteProcess::getRouteId, id)
        );

        routeMapper.deleteById(id);
    }

    private void validateProcesses(RouteDTO routeDTO) {
        if (routeDTO.getProcesses() == null) {
            return;
        }

        Set<Long> processIds = new HashSet<>();
        for (RouteDTO.RouteProcessItem item : routeDTO.getProcesses()) {
            if (item.getProcessId() == null) {
                throw new RuntimeException("工序不能为空");
            }
            if (item.getSequence() == null || item.getSequence() <= 0) {
                throw new RuntimeException("工序顺序必须大于0");
            }
            if (!processIds.add(item.getProcessId())) {
                throw new RuntimeException("同一路线中不能重复添加工序");
            }

            MesProcess process = processMapper.selectById(item.getProcessId());
            if (process == null) {
                throw new RuntimeException("工序不存在");
            }
        }
    }

    private void saveRouteProcesses(Long routeId, RouteDTO routeDTO) {
        if (routeDTO.getProcesses() == null || routeDTO.getProcesses().isEmpty()) {
            return;
        }

        for (RouteDTO.RouteProcessItem item : routeDTO.getProcesses()) {
            RouteProcess routeProcess = new RouteProcess();
            routeProcess.setRouteId(routeId);
            routeProcess.setProcessId(item.getProcessId());
            routeProcess.setSequence(item.getSequence());
            routeProcess.setCreatedAt(LocalDateTime.now());
            routeProcessMapper.insert(routeProcess);
        }
    }
}
