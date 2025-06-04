package com.example.vnpay.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @Column(name = "order_id", nullable = false, updatable = false)
    private String orderId;  // UUID dạng chuỗi

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "status", nullable = false)
    private String status; // "PENDING", "SUCCESS", "FAILED", ...

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
