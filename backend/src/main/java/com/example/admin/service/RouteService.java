package com.example.admin.service;

import com.example.admin.common.PageResult;
import com.example.admin.dto.RouteDTO;
import com.example.admin.dto.RouteVO;
import com.example.admin.entity.Route;

public interface RouteService {
    PageResult<Route> getRouteList(int page, int pageSize, String keyword);
    Route getRouteById(Long id);
    RouteVO getRouteWithProcesses(Long id);
    Route createRoute(RouteDTO routeDTO);
    Route updateRoute(Long id, RouteDTO routeDTO);
    void deleteRoute(Long id);
}
