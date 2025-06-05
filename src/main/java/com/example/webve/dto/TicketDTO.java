package com.example.webve.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class TicketDTO {
    private String ticketId;
    private String eventId;
    private String eventTitle;
    private String ticketTypeId;
    private String ticketTypeName;
    private String fullName;
    private String status;
    private Timestamp purchaseDate;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private EventDTO event; // Thêm đối tượng EventDTO
    private TicketTypeDTO ticketType; // Thêm đối tượng TicketTypeDTO
}