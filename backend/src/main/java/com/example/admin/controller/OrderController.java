package com.example.admin.controller;

import com.example.admin.common.PageResult;
import com.example.admin.common.Result;
import com.example.admin.dto.OrderDTO;
import com.example.admin.dto.ProductionOrderVO;
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
    public Result<PageResult<ProductionOrderVO>> getOrderList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status) {
        PageResult<ProductionOrderVO> result = orderService.getOrderList(page, pageSize, keyword, status);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<ProductionOrderVO> getOrderById(@PathVariable Long id) {
        ProductionOrderVO order = orderService.getOrderById(id);
        return Result.success(order);
    }

    @PostMapping
    public Result<ProductionOrderVO> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        ProductionOrderVO order = orderService.createOrder(orderDTO);
        return Result.success(order, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<ProductionOrderVO> updateOrder(@PathVariable Long id, @RequestBody OrderDTO orderDTO) {
        ProductionOrderVO order = orderService.updateOrder(id, orderDTO);
        return Result.success(order, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return Result.success(null, "删除成功");
    }

    @PutMapping("/{id}/start")
    public Result<ProductionOrderVO> startProduction(@PathVariable Long id) {
        ProductionOrderVO order = orderService.startProduction(id);
        return Result.success(order, "开工成功");
    }

    @PutMapping("/{id}/complete")
    public Result<ProductionOrderVO> completeProduction(@PathVariable Long id) {
        ProductionOrderVO order = orderService.completeProduction(id);
        return Result.success(order, "完工成功");
    }

    @PutMapping("/{id}/cancel")
    public Result<ProductionOrderVO> cancelOrder(@PathVariable Long id) {
        ProductionOrderVO order = orderService.cancelOrder(id);
        return Result.success(order, "订单已取消");
    }
}
