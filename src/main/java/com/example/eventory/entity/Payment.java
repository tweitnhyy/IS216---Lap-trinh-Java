package com.example.eventory.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Payments")
@Data
public class Payment {

    @Id
    @Column(name = "payment_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payment_seq")
    @SequenceGenerator(name = "payment_seq", sequenceName = "payment_seq", allocationSize = 1)
    private String paymentId;

    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "transaction_id")
    private String transactionId;
}