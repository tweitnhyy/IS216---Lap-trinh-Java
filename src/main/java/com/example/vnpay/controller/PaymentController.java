package com.example.vnpay.controller;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.example.vnpay.dto.OrderDTO;
import com.example.vnpay.service.OrderService;
import com.example.vnpay.service.VnPayService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final VnPayService vnPayService;
    private final OrderService orderService;

    // ✅ Gọi bằng POST - server tự tạo orderId và gắn vào request
    @PostMapping("/vnpay")
    public RedirectView createVnPayPayment(@RequestBody OrderDTO request,
                                           HttpServletRequest httpServletRequest) {
        // Tạo đơn hàng trước, lấy ra orderId
        String orderId = orderService.createOrder(request);
        if (orderId == null) {
            return new RedirectView("/payment.html?error=order_creation_failed");
        }

        request.setOrderID(orderId); // Gắn orderId vào request để truyền sang VnPayService
        String paymentUrl = vnPayService.createPaymentUrl(request, httpServletRequest);
        return new RedirectView("/payment.html?url=" + URLEncoder.encode(paymentUrl, StandardCharsets.UTF_8));
    }

    // ✅ Cho phép gọi thử bằng GET (ví dụ dùng cho test nhanh)
    @GetMapping("/vnpay")
    public RedirectView createVnPayPaymentFromGet(@RequestParam float price,
                                                  HttpServletRequest request) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setPrice(BigDecimal.valueOf(price));

        String orderId = orderService.createOrder(orderDTO);
        if (orderId == null) {
            return new RedirectView("/payment.html?error=order_creation_failed");
        }

        orderDTO.setOrderID(orderId);
        String paymentUrl = vnPayService.createPaymentUrl(orderDTO, request);
        System.out.println("Payment URL: " + paymentUrl);
        return new RedirectView("/payment.html?url=" + URLEncoder.encode(paymentUrl, StandardCharsets.UTF_8));
    }

    // ✅ Nhận callback từ VNPay sau thanh toán
    @GetMapping("/vnpay/return")
    public RedirectView handleVnPayReturn(@RequestParam Map<String, String> params) {
        boolean isValid = vnPayService.verifyReturnData(params);
        if (!isValid) {
            return new RedirectView("/return.html?error=invalid_hash");
        }

        String orderId = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");

        // Gọi xử lý kết quả thanh toán
        vnPayService.handlePaymentResult(orderId, responseCode);

        String query = params.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("&"));
        return new RedirectView("/return.html?" + query);
    }
}