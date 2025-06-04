package com.example.vnpay.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.vnpay.dto.OrderDTO;

@Service
public class OrderService {

    public synchronized String createOrder(OrderDTO request) {
        String orderId = UUID.randomUUID().toString();
        double totalAmount = request.getPrice() * request.getQuantity();

        // Save to DB using JPA or JDBC (pseudo code):
        // orderRepository.save(new Order(...));

        System.out.println("Created order: " + orderId + " with amount: " + totalAmount);
        return orderId;
    }
}