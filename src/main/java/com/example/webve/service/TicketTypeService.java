package com.example.webve.service;

import com.example.webve.model.TicketType;
import com.example.webve.repository.TicketTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class TicketTypeService {

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    public TicketType findById(String ticketTypeId) {
        return ticketTypeRepository.findById(ticketTypeId)
                .orElseThrow(() -> new RuntimeException("TicketType not found with ID: " + ticketTypeId));
    }

    public void save(TicketType ticketType) {
        ticketTypeRepository.save(ticketType);
    }

    public boolean isTicketSaleActive(TicketType ticketType) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        return (ticketType.getTicketSaleStart() == null || now.after(ticketType.getTicketSaleStart()))
                && (ticketType.getTicketSaleEnd() == null || now.before(ticketType.getTicketSaleEnd()));
    }

    public boolean isValidQuantityForOrder(TicketType ticketType, int requestedQuantity) {
        if (ticketType.getMaxPerOrder() != null && requestedQuantity > ticketType.getMaxPerOrder()) {
            return false;
        }
        return ticketType.getQuantity() >= requestedQuantity;
    }

    public TicketType findByEventIdAndType(String eventId, String type) {
        return ticketTypeRepository.findByEventEventIdAndType(eventId, type)
                .orElseThrow(() -> new RuntimeException("TicketType not found for eventId: " + eventId + " and type: " + type));
    }
}