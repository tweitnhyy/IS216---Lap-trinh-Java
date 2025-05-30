package com.example.webve.repository;

import com.example.webve.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // Bạn có thể thêm các phương thức tùy chỉnh ở đây nếu cần
    // Tìm sự kiện theo eventId
    Event findByEventId(String eventId);

    String findByTitle(String title);
}
