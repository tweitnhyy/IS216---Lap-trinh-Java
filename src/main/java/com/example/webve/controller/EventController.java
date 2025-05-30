package com.example.webve.controller;

import com.example.webve.dto.EventCreationDTO;
import com.example.webve.dto.EventDTO;
import com.example.webve.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    // API tạo sự kiện
    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventCreationDTO creationDTO) {
        EventDTO createdEvent = eventService.createEvent(creationDTO.getEventDTO(), creationDTO.getTicketTypeDTOs());
        return ResponseEntity.ok(createdEvent);
    }

    // API lấy sự kiện theo ID
    @GetMapping("/{eventId}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable String eventId) {
        EventDTO eventDTO = eventService.getEventById(eventId);
        return ResponseEntity.ok(eventDTO);
    }
}