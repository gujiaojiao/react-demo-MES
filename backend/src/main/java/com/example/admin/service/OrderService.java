package com.example.admin.service;

import com.example.admin.common.PageResult;
import com.example.admin.dto.OrderDTO;
import com.example.admin.dto.ProductionOrderVO;

public interface OrderService {
    PageResult<ProductionOrderVO> getOrderList(int page, int pageSize, String keyword, Integer status);
    ProductionOrderVO getOrderById(Long id);
    ProductionOrderVO createOrder(OrderDTO orderDTO);
    ProductionOrderVO updateOrder(Long id, OrderDTO orderDTO);
    void deleteOrder(Long id);
    ProductionOrderVO startProduction(Long id);
    ProductionOrderVO completeProduction(Long id);
    ProductionOrderVO cancelOrder(Long id);
}
