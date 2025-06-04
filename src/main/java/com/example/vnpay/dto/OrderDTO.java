package com.example.vnpay.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private String orderID; // Mã đơn hàng, sẽ được tạo tự động
    private String userId;
    private String eventId;
    private String ticketTypeId;
    private int quantity;
    private BigDecimal price;
}
