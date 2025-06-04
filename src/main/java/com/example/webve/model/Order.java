package com.example.webve.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @Column(name = "ORDER_ID", nullable = false, length = 50)
    private String orderId;

    @Column(name = "USER_ID", nullable = false, length = 50)
    private String userId;

    @Column(name = "EVENT_ID", nullable = false, length = 50)
    private String eventId;

    @Column(name = "TICKET_TYPE_ID", nullable = false, length = 50)
    private String ticketTypeId;

    @Column(name = "QUANTITY", nullable = false)
    private Integer quantity;

    @Column(name = "PRICE", nullable = false)
    private BigDecimal price;

    @Column(name = "TOTAL_AMOUNT", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "ORDER_DATE", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "STATUS", length = 20)
    private String status;

    @Column(name = "PAYMENT_METHOD", length = 50)
    private String paymentMethod;

    @Column(name = "PAYMENT_STATUS", length = 20)
    private String paymentStatus;

    @Column(name = "TRANSACTION_ID", length = 100)
    private String transactionId;

    @Column(name = "DISCOUNT")
    private BigDecimal discount;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
}
