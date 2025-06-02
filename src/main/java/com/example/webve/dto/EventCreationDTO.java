package com.example.webve.dto;

import lombok.Data;

import java.util.List;

@Data
public class EventCreationDTO {
    private EventDTO eventDTO;
    private List<TicketTypeDTO> ticketTypeDTOs;
}