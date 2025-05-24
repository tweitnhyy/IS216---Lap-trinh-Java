package com.example.webve.service;

import com.example.webve.model.Event;
import com.example.webve.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    // Thêm các phương thức khác như tìm kiếm, xóa, cập nhật sự kiện nếu cần
}
