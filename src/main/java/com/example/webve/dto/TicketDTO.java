package com.example.webve.dto;

import lombok.Data;
import com.example.webve.model.Ticket;

import java.sql.Timestamp;

@Data
public class TicketDTO {
    private String ticketId;
    private String ticketTypeId;
    private String eventId;
    private String userId;
    private String status;
    private Timestamp purchaseDate;

}