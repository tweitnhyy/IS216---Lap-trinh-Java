package com.example.eventory.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Orders")
@Data
public class Order {
    @Id
    @Column(name = "order_id")
    private String orderId;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @Column(name = "ticket_id", nullable = false)
    private String ticketId;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(nullable = false)
    private String status;



}