package com.example.vnpay.controller;

import com.example.vnpay.model.PaymentRequest;
import com.example.vnpay.service.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final VnPayService vnPayService;

    // ✅ Gọi bằng POST (đúng chuẩn từ frontend hoặc Postman)
    @PostMapping("/vnpay")
    public RedirectView createVnPayPayment(@RequestBody PaymentRequest request,
                                           HttpServletRequest httpServletRequest) {
        String paymentUrl = vnPayService.createPaymentUrl(request, httpServletRequest);
        return new RedirectView("/payment.html?url=" + URLEncoder.encode(paymentUrl, StandardCharsets.UTF_8));
    }

    // ✅ Cho phép gọi thử bằng GET trên trình duyệt (tùy chọn)
    @GetMapping("/vnpay")
    public RedirectView createVnPayPaymentFromGet(@RequestParam String orderId,
                                                  @RequestParam String orderInfo,
                                                  @RequestParam BigDecimal amount,
                                                  HttpServletRequest request) {
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setOrderId(orderId);
        paymentRequest.setOrderInfo(orderInfo);
        paymentRequest.setAmount(amount);
        String paymentUrl = vnPayService.createPaymentUrl(paymentRequest, request);
        return new RedirectView("/payment.html?url=" + URLEncoder.encode(paymentUrl, StandardCharsets.UTF_8));
    }

    // ✅ Nhận callback từ VNPay sau thanh toán
    @GetMapping("/vnpay/return")
    public RedirectView handleVnPayReturn(@RequestParam Map<String, String> params) {

        // Gửi lại dữ liệu cho frontend qua URL để return.html xử lý
        String query = params.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("&"));
        return new RedirectView("/return.html?" + query);
    }
}
