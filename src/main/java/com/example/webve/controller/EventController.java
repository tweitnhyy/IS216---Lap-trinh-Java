package com.example.webve.controller;

import com.example.webve.dto.EventCreationDTO;
import com.example.webve.dto.EventDTO;
import com.example.webve.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    // API tạo sự kiện
    @PostMapping("/create-events/{userId}")
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventCreationDTO creationDTO, @PathVariable String userId) {
        EventDTO createdEvent = eventService.createEvent(creationDTO.getEventDTO(), creationDTO.getTicketTypeDTOs(), userId);
        return ResponseEntity.ok(createdEvent);
    }

    // API lấy sự kiện theo ID
    @GetMapping("/{eventId}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable String eventId) {
        EventDTO eventDTO = eventService.getEventById(eventId);
        return ResponseEntity.ok(eventDTO);
    }
}