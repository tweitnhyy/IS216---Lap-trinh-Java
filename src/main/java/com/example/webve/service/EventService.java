package com.example.webve.service;

import com.example.webve.dto.EventDTO;
import com.example.webve.dto.TicketTypeDTO;
import com.example.webve.model.Event;
import com.example.webve.model.TicketType;
import com.example.webve.repository.EventRepository;
import com.example.webve.repository.TicketTypeRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    public EventDTO createEvent(EventDTO eventDTO, List<TicketTypeDTO> ticketTypeDTOs) {
        // Sinh UUID cho eventId
        eventDTO.setEventId(UUID.randomUUID().toString());

        Event event = new Event();
        // Copy dữ liệu từ DTO sang Entity
        BeanUtils.copyProperties(eventDTO, event);
        // Lưu sự kiện vào cơ sở dữ liệu
        event = eventRepository.save(event);

        // Xử lý và lưu các loại vé
        List<TicketTypeDTO> savedTicketTypeDTOs = null;
        if (ticketTypeDTOs != null && !ticketTypeDTOs.isEmpty()) {
            Event finalEvent = event;
            List<TicketType> ticketTypes = ticketTypeDTOs.stream().map(ticketTypeDTO -> {
                TicketType ticketType = new TicketType();
                ticketType.setTicketTypeId(UUID.randomUUID().toString());
                BeanUtils.copyProperties(ticketTypeDTO, ticketType);
                ticketType.setEventId(finalEvent.getEventId());
                if (ticketType.getTicketSaleStart() == null) {
                    ticketType.setTicketSaleStart(eventDTO.getTicketSaleStart());
                }
                if (ticketType.getTicketSaleEnd() == null) {
                    ticketType.setTicketSaleEnd(eventDTO.getTicketSaleEnd());
                }
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

        return eventDTO;
    }

    // Lấy sự kiện theo ID, bao gồm danh sách vé
    public EventDTO getEventById(String eventId) {
        Event event = eventRepository.findByEventId(eventId);
        if (event == null) {
            throw new RuntimeException("Event not found with ID: " + eventId);
        }
        EventDTO eventDTO = new EventDTO();
        BeanUtils.copyProperties(event, eventDTO);

        // Lấy danh sách vé liên quan đến sự kiện
        List<TicketType> ticketTypes = ticketTypeRepository.findByEventId(eventId);
        if (ticketTypes != null && !ticketTypes.isEmpty()) {
            List<TicketTypeDTO> ticketTypeDTOs = ticketTypes.stream().map(ticketType -> {
                TicketTypeDTO ticketTypeDTO = new TicketTypeDTO();
                BeanUtils.copyProperties(ticketType, ticketTypeDTO);
                return ticketTypeDTO;
            }).collect(Collectors.toList());
            eventDTO.setTickets(ticketTypeDTOs); // Gán danh sách vé vào EventDTO
        }

        return eventDTO;
    }
}