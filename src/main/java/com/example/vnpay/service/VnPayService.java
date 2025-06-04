package com.example.vnpay.service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.vnpay.model.PaymentRequest;
import com.example.vnpay.util.VnPayUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VnPayService {

    @Value("${vnpay.paymentUrl}")
    private String vnpayUrl;

    @Value("${vnpay.returnUrl}")
    private String returnUrl;

    @Value("${vnpay.tmnCode}")
    private String tmnCode;

    @Value("${vnpay.secretKey}")
    private String secretKey;

    public String createPaymentUrl(PaymentRequest request, HttpServletRequest servletRequest) {
        String vnp_TxnRef = request.getOrderID(); // UUID.randomUUID().toString();
        String vnp_OrderInfo = request.getOrderInfo();
        String vnp_Amount = String.valueOf(request.getAmount().multiply(BigDecimal.valueOf(100)).intValue());

        String vnp_IpAddr = servletRequest.getRemoteAddr();
        String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        Calendar expireCalendar = Calendar.getInstance();
        expireCalendar.add(Calendar.MINUTE, 15); // hết hạn sau 15 phút
        String vnp_ExpireDate = new SimpleDateFormat("yyyyMMddHHmmss").format(expireCalendar.getTime());

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", tmnCode);
        vnpParams.put("vnp_Amount", vnp_Amount);
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", vnp_TxnRef);
        vnpParams.put("vnp_OrderInfo", vnp_OrderInfo);
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", returnUrl);
        vnpParams.put("vnp_IpAddr", vnp_IpAddr);
        vnpParams.put("vnp_CreateDate", vnp_CreateDate);
        vnpParams.put("vnp_ExpireDate", vnp_ExpireDate);
        vnpParams.put("vnp_OrderType", 	"250000");

        String queryUrl = VnPayUtil.buildUrlWithSecureHash(vnpParams, secretKey);
        return vnpayUrl + "?" + queryUrl;
    }

    public boolean verifyReturnData(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        Map<String, String> filteredParams = new HashMap<>(params);
        filteredParams.remove("vnp_SecureHash");
        filteredParams.remove("vnp_SecureHashType");

        String computedHash = VnPayUtil.calculateHash(filteredParams, secretKey);
        return receivedHash != null && receivedHash.equals(computedHash);
    }

    public void handlePaymentResult(String orderId, String responseCode) {
        switch (responseCode) {
            case "00" -> System.out.println("Order " + orderId + " paid successfully.");
            case "24" -> System.out.println("Order " + orderId + " was cancelled.");
            default -> System.out.println("Order " + orderId + " payment failed.");
        }
    }
}
