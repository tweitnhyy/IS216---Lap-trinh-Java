package com.example.webve.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "Ticket_types")
public class TicketType {

    @Id
    @Column(name = "ticket_type_id")
    private String ticketTypeId;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "price", nullable = false)
    private Integer price;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "max_per_order")
    private Integer maxPerOrder;

    @Column(name = "ticket_sale_start")
    private Timestamp ticketSaleStart; // Thời gian mở bán vé riêng

    @Column(name = "ticket_sale_end")
    private Timestamp ticketSaleEnd; // Thời gian đóng bán vé riêng

    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", referencedColumnName = "event_id")
    private Event event;

    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
        updatedAt = new Timestamp(System.currentTimeMillis());
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }
}