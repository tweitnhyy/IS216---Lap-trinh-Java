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

import java.util.List;

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

    // API lấy danh sách sự kiện có video không null
    @GetMapping("/no-auth/video-events")
    public ResponseEntity<List<EventDTO>> getVideoEvents() {
        try {
            List<EventDTO> events = eventService.getVideoEvents();
            if (events.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    // API lấy danh sách sự kiện sắp diễn ra
    @GetMapping("/no-auth/upcoming")
    public ResponseEntity<List<EventDTO>> getUpcomingEvents() {
        try {
            List<EventDTO> events = eventService.getUpcomingEvents();
            if (events.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/no-auth/random")
    public ResponseEntity<List<EventDTO>> getRandomEvents() {
        try {
            List<EventDTO> events = eventService.getRandomEvents();
            if (events.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}