package com.example.eventory.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "Tickettypes")
@Data
public class TicketType {

    @Id
    @Column(name = "ticket_type_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ticket_type_seq")
    @SequenceGenerator(name = "ticket_type_seq", sequenceName = "ticket_type_seq", allocationSize = 1)
    private String ticketTypeId;

    @Column(name = "event_id", nullable = false)
    private String eventId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "quantity_available", nullable = false)
    private Integer quantityAvailable;

    @Column(name = "quantity_sold")
    private Integer quantitySold;
}