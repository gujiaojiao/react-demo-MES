package com.example.admin.service;

import com.example.admin.common.PageResult;
import com.example.admin.dto.OrderDTO;
import com.example.admin.entity.ProductionOrder;

public interface OrderService {
    PageResult<ProductionOrder> getOrderList(int page, int pageSize, String keyword, Integer status);
    ProductionOrder getOrderById(Long id);
    ProductionOrder createOrder(OrderDTO orderDTO);
    ProductionOrder updateOrder(Long id, OrderDTO orderDTO);
    void deleteOrder(Long id);
    ProductionOrder startProduction(Long id);
    ProductionOrder completeProduction(Long id);
    ProductionOrder cancelOrder(Long id);
}