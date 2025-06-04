package com.example.vnpay.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private String orderID; 
    private String userId;
    private String eventId;
    private String ticketTypeId;
    private int quantity;
    private BigDecimal price;
    private String status; // "PENDING", "SUCCESS", "FAILED", ...
    private LocalDateTime createdAt; // Thời gian tạo đơn hàng, có thể là chuỗi định dạng ngày giờ
}
