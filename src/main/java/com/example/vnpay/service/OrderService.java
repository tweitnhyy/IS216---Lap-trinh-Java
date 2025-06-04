package com.example.vnpay.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.vnpay.dto.OrderDTO;

@Service
public class OrderService {

    public synchronized String createOrder(OrderDTO request) {
        String orderId = UUID.randomUUID().toString();
        return orderId;
    }
}