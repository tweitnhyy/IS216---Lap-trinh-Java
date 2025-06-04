package com.example.webve.service;

import com.example.webve.dto.EventDTO;
import com.example.webve.dto.TicketTypeDTO;
import com.example.webve.model.Event;
import com.example.webve.model.TicketType;
import com.example.webve.model.User;
import com.example.webve.repository.EventRepository;
import com.example.webve.repository.TicketTypeRepository;
import com.example.webve.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public EventDTO createEvent(EventDTO eventDTO, List<TicketTypeDTO> ticketTypeDTOs, String userId) {
        // Kiểm tra userId có tồn tại
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Sinh UUID cho eventId
        eventDTO.setEventId(UUID.randomUUID().toString());
        eventDTO.setUserId(userId);

        Event event = new Event();
        // Copy dữ liệu từ DTO sang Entity
        BeanUtils.copyProperties(eventDTO, event);
        event.setUser(user);
        // Lưu sự kiện vào cơ sở dữ liệu
        event = eventRepository.save(event);

        // Xử lý và lưu các loại vé
        List<TicketTypeDTO> savedTicketTypeDTOs = new ArrayList<>();
        if (ticketTypeDTOs != null && !ticketTypeDTOs.isEmpty()) {
            Event finalEvent = event;
            List<TicketType> ticketTypes = ticketTypeDTOs.stream().map(ticketTypeDTO -> {
                TicketType ticketType = new TicketType();
                ticketType.setTicketTypeId(UUID.randomUUID().toString());
                BeanUtils.copyProperties(ticketTypeDTO, ticketType);
                ticketType.setEvent(finalEvent);
                return ticketType;
            }).collect(Collectors.toList());
            // Lưu danh sách vé vào cơ sở dữ liệu
            List<TicketType> savedTicketTypes = ticketTypeRepository.saveAll(ticketTypes);
            // Chuyển đổi danh sách vé đã lưu thành DTO để trả về
            savedTicketTypeDTOs = savedTicketTypes.stream().map(ticketType -> {
                TicketTypeDTO ticketTypeDTO = new TicketTypeDTO();
                BeanUtils.copyProperties(ticketType, ticketTypeDTO);
                return ticketTypeDTO;
            }).collect(Collectors.toList());
        }

        // Copy dữ liệu từ Entity trở lại DTO để trả về
        BeanUtils.copyProperties(event, eventDTO);
        // Gán danh sách vé đã lưu vào DTO
        eventDTO.setTickets(savedTicketTypeDTOs);
        eventDTO.setUserId(user.getUserId());

        return eventDTO;
    }

    public EventDTO getEventById(String eventId) {
        Event event = eventRepository.findByEventId(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));

        EventDTO eventDTO = new EventDTO();
        BeanUtils.copyProperties(event, eventDTO);

        // Lấy danh sách vé từ mối quan hệ @OneToMany
        List<TicketType> ticketTypes = event.getTicketTypes();
        if (ticketTypes != null && !ticketTypes.isEmpty()) {
            List<TicketTypeDTO> ticketTypeDTOs = ticketTypes.stream().map(ticketType -> {
                TicketTypeDTO ticketTypeDTO = new TicketTypeDTO();
                BeanUtils.copyProperties(ticketType, ticketTypeDTO);
                return ticketTypeDTO;
            }).collect(Collectors.toList());
            eventDTO.setTickets(ticketTypeDTOs);
        } else {
            eventDTO.setTickets(new ArrayList<>());
        }

        return eventDTO;
    }

    public List<EventDTO> getVideoEvents() {
        List<Event> events = eventRepository.findTop4ByVideoIsNotNullOrderByCreatedAtDesc();
        return events.stream().map(event -> {
            EventDTO eventDTO = new EventDTO();
            BeanUtils.copyProperties(event, eventDTO);

            // Lấy danh sách vé
            List<TicketType> ticketTypes = event.getTicketTypes();
            if (ticketTypes != null && !ticketTypes.isEmpty()) {
                List<TicketTypeDTO> ticketTypeDTOs = ticketTypes.stream().map(ticketType -> {
                    TicketTypeDTO ticketTypeDTO = new TicketTypeDTO();
                    BeanUtils.copyProperties(ticketType, ticketTypeDTO);
                    return ticketTypeDTO;
                }).collect(Collectors.toList());
                eventDTO.setTickets(ticketTypeDTOs);
            } else {
                eventDTO.setTickets(new ArrayList<>());
            }

            return eventDTO;
        }).collect(Collectors.toList());
    }


    public List<EventDTO> getUpcomingEvents() {
        Timestamp currentDate = Timestamp.from(Instant.now());
        List<Event> events = eventRepository.findByStartDateTimeGreaterThanEqualOrderByStartDateTimeAsc(currentDate);
        return events.stream().map(event -> {
            EventDTO eventDTO = new EventDTO();
            BeanUtils.copyProperties(event, eventDTO);

            List<TicketType> ticketTypes = event.getTicketTypes();
            if (ticketTypes != null && !ticketTypes.isEmpty()) {
                List<TicketTypeDTO> ticketTypeDTOs = ticketTypes.stream().map(ticketType -> {
                    TicketTypeDTO ticketTypeDTO = new TicketTypeDTO();
                    BeanUtils.copyProperties(ticketType, ticketTypeDTO);
                    return ticketTypeDTO;
                }).collect(Collectors.toList());
                eventDTO.setTickets(ticketTypeDTOs);
            } else {
                eventDTO.setTickets(new ArrayList<>());
            }

            return eventDTO;
        }).collect(Collectors.toList());
    }


    public List<EventDTO> getRandomEvents() {
        List<Event> events = eventRepository.findRandom10Events();
        return events.stream().map(event -> {
            EventDTO eventDTO = new EventDTO();
            BeanUtils.copyProperties(event, eventDTO);

            List<TicketType> ticketTypes = event.getTicketTypes();
            if (ticketTypes != null && !ticketTypes.isEmpty()) {
                List<TicketTypeDTO> ticketTypeDTOs = ticketTypes.stream().map(ticketType -> {
                    TicketTypeDTO ticketTypeDTO = new TicketTypeDTO();
                    BeanUtils.copyProperties(ticketType, ticketTypeDTO);
                    return ticketTypeDTO;
                }).collect(Collectors.toList());
                eventDTO.setTickets(ticketTypeDTOs);
            } else {
                eventDTO.setTickets(new ArrayList<>());
            }

            return eventDTO;
        }).collect(Collectors.toList());
    }
}