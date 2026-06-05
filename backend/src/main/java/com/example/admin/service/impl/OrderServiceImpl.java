package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.common.PageResult;
import com.example.admin.dto.OrderDTO;
import com.example.admin.dto.ProductionOrderVO;
import com.example.admin.entity.Product;
import com.example.admin.entity.ProductionOrder;
import com.example.admin.entity.Route;
import com.example.admin.mapper.OrderMapper;
import com.example.admin.mapper.ProductMapper;
import com.example.admin.mapper.RouteMapper;
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
    private final ProductMapper productMapper;
    private final RouteMapper routeMapper;

    @Override
    public PageResult<ProductionOrderVO> getOrderList(int page, int pageSize, String keyword, Integer status) {
        Page<ProductionOrderVO> pageResult = new Page<>(page, pageSize);
        pageResult.setRecords(orderMapper.selectOrderPage(pageResult, keyword, status));
        return new PageResult<>(pageResult.getRecords(), pageResult.getTotal());
    }

    @Override
    public ProductionOrderVO getOrderById(Long id) {
        ProductionOrderVO order = orderMapper.selectOrderDetailById(id);
        if (order == null) {
            throw new RuntimeException("生产订单不存在");
        }
        return order;
    }

    @Override
    public ProductionOrderVO createOrder(OrderDTO orderDTO) {
        validateOrderPayload(orderDTO);

        String orderNo = orderDTO.getOrderNo();
        if (!StringUtils.hasText(orderNo)) {
            orderNo = generateOrderNo();
        } else {
            ensureOrderNoUnique(orderNo, null);
        }

        ProductionOrder order = new ProductionOrder();
        order.setOrderNo(orderNo);
        order.setProductId(orderDTO.getProductId());
        order.setRouteId(orderDTO.getRouteId());
        order.setQuantity(orderDTO.getQuantity());
        order.setStatus(0);
        order.setPlanStartDate(orderDTO.getPlanStartDate());
        order.setPlanEndDate(orderDTO.getPlanEndDate());
        order.setCreatedAt(LocalDateTime.now());

        orderMapper.insert(order);
        return getOrderById(order.getId());
    }

    @Override
    public ProductionOrderVO updateOrder(Long id, OrderDTO orderDTO) {
        ProductionOrder order = getOrderEntity(id);
        ensurePending(order, "只有未开始状态的订单可以编辑");

        String orderNo = StringUtils.hasText(orderDTO.getOrderNo()) ? orderDTO.getOrderNo() : order.getOrderNo();
        Long productId = orderDTO.getProductId() != null ? orderDTO.getProductId() : order.getProductId();
        Long routeId = orderDTO.getRouteId() != null ? orderDTO.getRouteId() : order.getRouteId();
        Integer quantity = orderDTO.getQuantity() != null ? orderDTO.getQuantity() : order.getQuantity();
        LocalDate planStartDate =
                orderDTO.getPlanStartDate() != null ? orderDTO.getPlanStartDate() : order.getPlanStartDate();
        LocalDate planEndDate =
                orderDTO.getPlanEndDate() != null ? orderDTO.getPlanEndDate() : order.getPlanEndDate();

        ensureOrderNoUnique(orderNo, id);
        validateProductExists(productId);
        validateRouteExists(routeId);
        validateQuantity(quantity);
        validatePlanDates(planStartDate, planEndDate);

        order.setOrderNo(orderNo);
        order.setProductId(productId);
        order.setRouteId(routeId);
        order.setQuantity(quantity);
        order.setPlanStartDate(planStartDate);
        order.setPlanEndDate(planEndDate);

        orderMapper.updateById(order);
        return getOrderById(id);
    }

    @Override
    public void deleteOrder(Long id) {
        ProductionOrder order = getOrderEntity(id);
        ensurePending(order, "只有未开始状态的订单可以删除");
        orderMapper.deleteById(id);
    }

    @Override
    public ProductionOrderVO startProduction(Long id) {
        ProductionOrder order = getOrderEntity(id);
        ensurePending(order, "只有未开始状态的订单可以开工");
        order.setStatus(1);
        orderMapper.updateById(order);
        return getOrderById(id);
    }

    @Override
    public ProductionOrderVO completeProduction(Long id) {
        ProductionOrder order = getOrderEntity(id);
        ensureInProgress(order, "只有进行中的订单可以完工");
        order.setStatus(2);
        orderMapper.updateById(order);
        return getOrderById(id);
    }

    @Override
    public ProductionOrderVO cancelOrder(Long id) {
        ProductionOrder order = getOrderEntity(id);
        ensureInProgress(order, "只有进行中的订单可以取消");
        order.setStatus(3);
        orderMapper.updateById(order);
        return getOrderById(id);
    }

    private ProductionOrder getOrderEntity(Long id) {
        ProductionOrder order = orderMapper.selectById(id);
        if (order == null) {
            throw new RuntimeException("生产订单不存在");
        }
        return order;
    }

    private void validateOrderPayload(OrderDTO orderDTO) {
        validateProductExists(orderDTO.getProductId());
        validateRouteExists(orderDTO.getRouteId());
        validateQuantity(orderDTO.getQuantity());
        validatePlanDates(orderDTO.getPlanStartDate(), orderDTO.getPlanEndDate());
    }

    private void validateProductExists(Long productId) {
        Product product = productMapper.selectById(productId);
        if (product == null) {
            throw new RuntimeException("产品不存在");
        }
    }

    private void validateRouteExists(Long routeId) {
        Route route = routeMapper.selectById(routeId);
        if (route == null) {
            throw new RuntimeException("工艺路线不存在");
        }
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("生产数量必须大于0");
        }
    }

    private void validatePlanDates(LocalDate planStartDate, LocalDate planEndDate) {
        if (planStartDate != null && planEndDate != null && planEndDate.isBefore(planStartDate)) {
            throw new RuntimeException("计划结束日期不能早于计划开始日期");
        }
    }

    private void ensureOrderNoUnique(String orderNo, Long currentId) {
        if (!StringUtils.hasText(orderNo)) {
            return;
        }

        LambdaQueryWrapper<ProductionOrder> wrapper = new LambdaQueryWrapper<ProductionOrder>()
                .eq(ProductionOrder::getOrderNo, orderNo);
        if (currentId != null) {
            wrapper.ne(ProductionOrder::getId, currentId);
        }

        Long count = orderMapper.selectCount(wrapper);
        if (count > 0) {
            throw new RuntimeException("订单号已存在");
        }
    }

    private String generateOrderNo() {
        return "PO-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                + "-" + String.format("%03d", orderMapper.selectCount(null) + 1);
    }

    private void ensurePending(ProductionOrder order, String message) {
        if (order.getStatus() == null || order.getStatus() != 0) {
            throw new RuntimeException(message);
        }
    }

    private void ensureInProgress(ProductionOrder order, String message) {
        if (order.getStatus() == null || order.getStatus() != 1) {
            throw new RuntimeException(message);
        }
    }
}
