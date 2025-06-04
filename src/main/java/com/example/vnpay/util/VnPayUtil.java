package com.example.vnpay.util;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class VnPayUtil {

    // Thay vì dùng @Value trong static context (không hoạt động), truyền vào từ
    // caller
    public static String buildUrlWithSecureHash(Map<String, String> params, String secretKey) {
        // B1: Sắp xếp tham số theo key A-Z
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {
            String key = fieldNames.get(i);
            String value = params.get(key);
            if (value != null && value.length() > 0) {
                // hashData dùng để tạo SecureHash (giữ nguyên encoding như VNPay yêu cầu)
                hashData.append(key).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                // query dùng để đưa lên URL
                query.append(URLEncoder.encode(key, StandardCharsets.US_ASCII)).append('=')
                        .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                if (i < fieldNames.size() - 1) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        String secureHash = hmacSHA512(secretKey, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        return query.toString();
    }

    public static String hmacSHA512(final String key, final String data) {
        try {

            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            ex.printStackTrace();
            return "";
        }
    }

    // Optional - Dùng để test tính hash riêng
    public static String calculateHash(Map<String, String> fields, String secretKey) {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        for (String name : fieldNames) {
            String value = fields.get(name);
            if (value != null && !value.isEmpty()) {
                sb.append(name).append('=').append(value).append('&');
            }
        }
        // Remove '&' cuối cùng
        if (sb.length() > 0) {
            sb.setLength(sb.length() - 1);
        }

        return hmacSHA512(secretKey, sb.toString());
    }
}
