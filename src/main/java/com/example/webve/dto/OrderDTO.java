package com.example.webve.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
public class OrderDTO {

    private String userId;

    private String eventId;

    private String ticketTypeId;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal discount;

    private String paymentMethod;

    // Thông tin thanh toán trả về từ VNPAY
    private String transactionId;

    private String paymentStatus;
}