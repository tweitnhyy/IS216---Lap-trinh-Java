package com.example.eventory.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Tickets")
@Data
public class Ticket {

    @Id
    @Column(name = "ticket_id")
    private String ticketId;

    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(name = "ticket_type_id", nullable = false)
    private String ticketTypeId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "issued_at")
    private java.sql.Timestamp issuedAt;
}