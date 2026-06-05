package com.example.admin.controller;

import com.example.admin.common.PageResult;
import com.example.admin.common.Result;
import com.example.admin.dto.RouteDTO;
import com.example.admin.dto.RouteVO;
import com.example.admin.entity.Route;
import com.example.admin.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/route")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @GetMapping("/list")
    public Result<PageResult<Route>> getRouteList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword) {
        PageResult<Route> result = routeService.getRouteList(page, pageSize, keyword);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Route> getRouteById(@PathVariable Long id) {
        Route route = routeService.getRouteById(id);
        return Result.success(route);
    }

    @GetMapping("/{id}/with-processes")
    public Result<RouteVO> getRouteWithProcesses(@PathVariable Long id) {
        RouteVO route = routeService.getRouteWithProcesses(id);
        return Result.success(route);
    }

    @PostMapping
    public Result<Route> createRoute(@Valid @RequestBody RouteDTO routeDTO) {
        Route route = routeService.createRoute(routeDTO);
        return Result.success(route, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<Route> updateRoute(@PathVariable Long id, @RequestBody RouteDTO routeDTO) {
        Route route = routeService.updateRoute(id, routeDTO);
        return Result.success(route, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return Result.success(null, "删除成功");
    }
}
