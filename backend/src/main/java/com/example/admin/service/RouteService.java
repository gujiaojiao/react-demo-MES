package com.example.admin.service;

import com.example.admin.common.PageResult;
import com.example.admin.dto.RouteDTO;
import com.example.admin.entity.Route;

import java.util.List;

public interface RouteService {
    PageResult<Route> getRouteList(int page, int pageSize, String keyword);
    Route getRouteById(Long id);
    Route getRouteWithProcesses(Long id);
    Route createRoute(RouteDTO routeDTO);
    Route updateRoute(Long id, RouteDTO routeDTO);
    void deleteRoute(Long id);
}