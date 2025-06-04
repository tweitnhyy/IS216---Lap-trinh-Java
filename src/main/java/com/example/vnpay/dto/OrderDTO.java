package com.example.vnpay.dto;

import lombok.Data;

@Data
@lombok.Getter
@lombok.Setter
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class OrderDTO {
    private String userId;
    private String eventId;
    private String ticketTypeId;
    private int quantity;
    private double price;
}
