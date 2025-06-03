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

import com.example.vnpay.model.PaymentRequest;
import com.example.vnpay.service.VnPayService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

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
        paymentRequest.setOrderID(orderId);
        paymentRequest.setOrderInfo(orderInfo);
        paymentRequest.setAmount(amount);
        String paymentUrl = vnPayService.createPaymentUrl(paymentRequest, request);
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
        String query = params.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("&"));
        return new RedirectView("/return.html?" + query);
    }
}
