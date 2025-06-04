package com.example.vnpay.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.vnpay.dto.OrderDTO; 
import com.example.vnpay.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(@RequestBody OrderDTO request) {
        String orderId = orderService.createOrder(request);
        if (orderId == null) {
            return ResponseEntity.badRequest().body("Failed to create order");
        }
        return ResponseEntity.ok(orderId);
    }    
    
}

