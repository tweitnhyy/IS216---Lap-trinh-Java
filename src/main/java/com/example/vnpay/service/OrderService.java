package com.example.vnpay.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.vnpay.dto.OrderDTO;
import com.example.vnpay.entity.Order;
import com.example.vnpay.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    // Tạo đơn hàng mới
    public synchronized String createOrder(OrderDTO request) {
        String orderId = UUID.randomUUID().toString();

        Order order = new Order();
        order.setOrderId(orderId);
        order.setPrice(request.getPrice());
        order.setStatus("PENDING"); // mặc định trạng thái chờ thanh toán

        orderRepository.save(order);

        return orderId;
    }

    public void updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findByOrderId(orderId);
        if (order != null) {
            order.setStatus(status);
            orderRepository.save(order);
        }
    }
}
