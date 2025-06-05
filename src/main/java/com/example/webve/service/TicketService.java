package com.example.webve.service;

import com.example.webve.dto.EventDTO;
import com.example.webve.dto.TicketDTO;
import com.example.webve.dto.TicketTypeDTO;
import com.example.webve.model.Ticket;
import com.example.webve.repository.TicketRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    public List<TicketDTO> getTicketsByUserId(String userId) {
        List<Ticket> tickets = ticketRepository.findByUserUserId(userId);
        return tickets.stream().map(ticket -> {
            TicketDTO ticketDTO = new TicketDTO();
            BeanUtils.copyProperties(ticket, ticketDTO);

            // Thêm thông tin sự kiện
            if (ticket.getEvent() != null) {
                EventDTO eventDTO = new EventDTO();
                BeanUtils.copyProperties(ticket.getEvent(), eventDTO);
                ticketDTO.setEventId(ticket.getEvent().getEventId());
                ticketDTO.setEventTitle(ticket.getEvent().getTitle());
                ticketDTO.setEvent(eventDTO); // Bao gồm toàn bộ EventDTO
            }

            // Thêm thông tin hạng vé
            if (ticket.getTicketType() != null) {
                TicketTypeDTO ticketTypeDTO = new TicketTypeDTO();
                BeanUtils.copyProperties(ticket.getTicketType(), ticketTypeDTO);
                ticketDTO.setTicketTypeId(ticket.getTicketType().getTicketTypeId());
                ticketDTO.setTicketTypeName(ticket.getTicketType().getType());
                ticketDTO.setTicketType(ticketTypeDTO); // Bao gồm toàn bộ TicketTypeDTO
            }

            // Thêm họ tên người mua
            if (ticket.getUser() != null) {
                ticketDTO.setFullName(ticket.getUser().getFullName());
            }

            return ticketDTO;
        }).collect(Collectors.toList());
    }
}