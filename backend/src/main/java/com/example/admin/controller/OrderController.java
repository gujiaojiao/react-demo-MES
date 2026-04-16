package com.example.admin.controller;

import com.example.admin.common.PageResult;
import com.example.admin.common.Result;
import com.example.admin.dto.OrderDTO;
import com.example.admin.entity.ProductionOrder;
import com.example.admin.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/list")
    public Result<PageResult<ProductionOrder>> getOrderList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status) {
        PageResult<ProductionOrder> result = orderService.getOrderList(page, pageSize, keyword, status);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<ProductionOrder> getOrderById(@PathVariable Long id) {
        ProductionOrder order = orderService.getOrderById(id);
        return Result.success(order);
    }

    @PostMapping
    public Result<ProductionOrder> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        ProductionOrder order = orderService.createOrder(orderDTO);
        return Result.success(order, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<ProductionOrder> updateOrder(@PathVariable Long id, @RequestBody OrderDTO orderDTO) {
        ProductionOrder order = orderService.updateOrder(id, orderDTO);
        return Result.success(order, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return Result.success(null, "删除成功");
    }

    @PutMapping("/{id}/start")
    public Result<ProductionOrder> startProduction(@PathVariable Long id) {
        ProductionOrder order = orderService.startProduction(id);
        return Result.success(order, "开始生产");
    }

    @PutMapping("/{id}/complete")
    public Result<ProductionOrder> completeProduction(@PathVariable Long id) {
        ProductionOrder order = orderService.completeProduction(id);
        return Result.success(order, "生产完成");
    }

    @PutMapping("/{id}/cancel")
    public Result<ProductionOrder> cancelOrder(@PathVariable Long id) {
        ProductionOrder order = orderService.cancelOrder(id);
        return Result.success(order, "订单已取消");
    }
}