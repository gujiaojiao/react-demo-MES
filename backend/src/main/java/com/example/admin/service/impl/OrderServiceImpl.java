package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.common.PageResult;
import com.example.admin.dto.OrderDTO;
import com.example.admin.entity.ProductionOrder;
import com.example.admin.mapper.OrderMapper;
import com.example.admin.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderMapper orderMapper;

    @Override
    public PageResult<ProductionOrder> getOrderList(int page, int pageSize, String keyword, Integer status) {
        LambdaQueryWrapper<ProductionOrder> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w
                    .like(ProductionOrder::getOrderNo, keyword)
            );
        }

        if (status != null) {
            wrapper.eq(ProductionOrder::getStatus, status);
        }

        wrapper.orderByAsc(ProductionOrder::getId);

        Page<ProductionOrder> pageResult = orderMapper.selectPage(new Page<>(page, pageSize), wrapper);

        return new PageResult<>(pageResult.getRecords(), pageResult.getTotal());
    }

    @Override
    public ProductionOrder getOrderById(Long id) {
        ProductionOrder order = orderMapper.selectById(id);
        if (order == null) {
            throw new RuntimeException("生产订单不存在");
        }
        return order;
    }

    @Override
    public ProductionOrder createOrder(OrderDTO orderDTO) {
        // 自动生成订单号
        String orderNo = orderDTO.getOrderNo();
        if (!StringUtils.hasText(orderNo)) {
            orderNo = "PO-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                    + "-" + String.format("%03d", orderMapper.selectCount(null) + 1);
        } else {
            // 检查订单号是否已存在
            Long count = orderMapper.selectCount(
                    new LambdaQueryWrapper<ProductionOrder>()
                            .eq(ProductionOrder::getOrderNo, orderNo)
            );
            if (count > 0) {
                throw new RuntimeException("订单号已存在");
            }
        }

        ProductionOrder order = new ProductionOrder();
        order.setOrderNo(orderNo);
        order.setProductId(orderDTO.getProductId());
        order.setRouteId(orderDTO.getRouteId());
        order.setQuantity(orderDTO.getQuantity());
        order.setStatus(orderDTO.getStatus() != null ? orderDTO.getStatus() : 0); // 默认待产
        order.setPlanStartDate(orderDTO.getPlanStartDate());
        order.setPlanEndDate(orderDTO.getPlanEndDate());
        order.setCreatedAt(LocalDateTime.now());

        orderMapper.insert(order);

        return order;
    }

    @Override
    public ProductionOrder updateOrder(Long id, OrderDTO orderDTO) {
        ProductionOrder order = orderMapper.selectById(id);
        if (order == null) {
            throw new RuntimeException("生产订单不存在");
        }

        // 只有待产状态可以编辑
        if (order.getStatus() != 0) {
            throw new RuntimeException("只有待产状态的订单可以编辑");
        }

        if (orderDTO.getProductId() != null) {
            order.setProductId(orderDTO.getProductId());
        }

        if (orderDTO.getRouteId() != null) {
            order.setRouteId(orderDTO.getRouteId());
        }

        if (orderDTO.getQuantity() != null) {
            order.setQuantity(orderDTO.getQuantity());
        }

        if (orderDTO.getPlanStartDate() != null) {
            order.setPlanStartDate(orderDTO.getPlanStartDate());
        }

        if (orderDTO.getPlanEndDate() != null) {
            order.setPlanEndDate(orderDTO.getPlanEndDate());
        }

        orderMapper.updateById(order);

        return order;
    }

    @Override
    public void deleteOrder(Long id) {
        ProductionOrder order = orderMapper.selectById(id);
        if (order == null) {
            throw new RuntimeException("生产订单不存在");
        }

        // 只有待产状态可以删除
        if (order.getStatus() != 0) {
            throw new RuntimeException("只有待产状态的订单可以删除");
        }

        orderMapper.deleteById(id);
    }

    @Override
    public ProductionOrder startProduction(Long id) {
        ProductionOrder order = orderMapper.selectById(id);
        if (order == null) {
            throw new RuntimeException("生产订单不存在");
        }

        if (order.getStatus() != 0) {
            throw new RuntimeException("只有待产状态的订单可以开始生产");
        }

        order.setStatus(1); // 生产中
        orderMapper.updateById(order);

        return order;
    }

    @Override
    public ProductionOrder completeProduction(Long id) {
        ProductionOrder order = orderMapper.selectById(id);
        if (order == null) {
            throw new RuntimeException("生产订单不存在");
        }

        if (order.getStatus() != 1) {
            throw new RuntimeException("只有生产中的订单可以完成");
        }

        order.setStatus(2); // 已完成
        orderMapper.updateById(order);

        return order;
    }

    @Override
    public ProductionOrder cancelOrder(Long id) {
        ProductionOrder order = orderMapper.selectById(id);
        if (order == null) {
            throw new RuntimeException("生产订单不存在");
        }

        if (order.getStatus() != 1) {
            throw new RuntimeException("只有生产中的订单可以取消");
        }

        order.setStatus(3); // 已取消
        orderMapper.updateById(order);

        return order;
    }
}