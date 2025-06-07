package com.example.webve.controller;

import com.example.webve.dto.OrderDTO;
import com.example.webve.model.Order;
import com.example.webve.service.OrderService;
import com.example.webve.service.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/vnpay")
public class VnPayController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private VnPayService vnPayService;

    @PostMapping("/pay")
    public ResponseEntity<?> pay(@RequestBody OrderDTO orderDTO, HttpServletRequest request) {
        try {
            Order order = orderService.createOrder(orderDTO);
            String paymentUrl = vnPayService.createPaymentUrl(order, request);
            return ResponseEntity.ok(Map.of(
                    "paymentUrl", paymentUrl,
                    "orderId", order.getOrderId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Tạo đơn hàng thất bại: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/payment-return")
    public void paymentReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String orderId = request.getParameter("vnp_TxnRef");
        int result = vnPayService.validateReturnRequest(request);

        if (result == 1) {
            // Thanh toán thành công
            orderService.confirmOrderAndCreateTickets(orderId);
            response.sendRedirect("/account-ticket?payment=success");
        } else if (result == 0) {
            // Giao dịch thất bại
            response.sendRedirect("/event-detail?payment=fail");
        } else {
            // Sai chữ ký
            response.sendRedirect("/event-detail?payment=invalid-signature");
        }
    }
}
