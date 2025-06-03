package com.example.webve.controller;

import com.example.webve.dto.EventCreationDTO;
import com.example.webve.dto.EventDTO;
import com.example.webve.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    // API tạo sự kiện
    @PostMapping("/create-events")
    public ResponseEntity<?> createEvent(@RequestBody @Valid EventCreationDTO creationDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be authenticated to create an event");
        }
        String userId = authentication.getName();

        try {
            EventDTO createdEvent = eventService.createEvent(creationDTO.getEventDTO(), creationDTO.getTicketTypeDTOs(), userId);
            return ResponseEntity.ok(createdEvent);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // API lấy sự kiện theo ID
    @GetMapping("/no-auth/{eventId}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable String eventId) {
        EventDTO eventDTO = eventService.getEventById(eventId);
        return ResponseEntity.ok(eventDTO);
    }
}