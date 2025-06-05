package com.example.webve.controller;

import com.example.webve.dto.OrderDTO;
import com.example.webve.model.Order;
import com.example.webve.service.OrderService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/payment")
public class VnPayController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponse> createOrderAndPaymentUrl(@RequestBody OrderDTO orderDTO, HttpServletRequest request) {
        try {
            Order order = orderService.createOrder(orderDTO);
            return ResponseEntity.ok(new PaymentResponse(order.getOrderId(), null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new PaymentResponse(null, e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not available for sale") || e.getMessage().contains("exceeds available tickets")) {
                return ResponseEntity.badRequest().body(new PaymentResponse(null, e.getMessage()));
            }
            return ResponseEntity.status(500).body(new PaymentResponse(null, "Error creating order: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new PaymentResponse(null, "Error creating order: " + e.getMessage()));
        }
    }

    @PostMapping("/confirm-order")
    public ResponseEntity<PaymentResponse> confirmOrder(@RequestParam String orderId) {
        try {
            orderService.confirmOrderAndCreateTickets(orderId);
            return ResponseEntity.ok(new PaymentResponse(orderId, "Order confirmed and tickets created successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new PaymentResponse(null, "Error confirming order: " + e.getMessage()));
        }
    }
}

@Setter
@Getter
class PaymentResponse {
    private String orderId;
    private String errorMessage;

    public PaymentResponse(String orderId) {
        this.orderId = orderId;
        this.errorMessage = null;
    }

    public PaymentResponse(String orderId, String errorMessage) {
        this.orderId = orderId;
        this.errorMessage = errorMessage;
    }
}

@Setter
@Getter
class ErrorResponse {
    private String message;
    public ErrorResponse(String message) { this.message = message; }
}