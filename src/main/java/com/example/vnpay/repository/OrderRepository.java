package com.example.vnpay.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vnpay.entity.Order;

public interface OrderRepository extends JpaRepository<Order, String> {
    Order findByOrderId(String orderId);
}
