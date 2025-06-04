package com.example.webve.controller;

import com.example.webve.model.TicketType;
import com.example.webve.service.TicketTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ticket-types")
public class TicketTypeController {

    @Autowired
    private TicketTypeService ticketTypeService;

    @GetMapping
    public ResponseEntity<TicketType> getTicketTypeByEventAndType(
            @RequestParam String eventId,
            @RequestParam String type) {
        TicketType ticketType = ticketTypeService.findByEventIdAndType(eventId, type);
        return ResponseEntity.ok(ticketType);
    }
}