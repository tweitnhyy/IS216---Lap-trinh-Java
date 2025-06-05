package com.example.webve.repository;

import com.example.webve.model.Event;
import com.example.webve.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.sql.Timestamp;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {
    // Bạn có thể thêm các phương thức tùy chỉnh ở đây nếu cần
    // Tìm sự kiện theo eventId
    Optional<Event> findByEventId(String eventId);

    String findByTitle(String title);

    List<Event> findByUserUserId(String userId);

    List<Event> findTop4ByVideoIsNotNullOrderByCreatedAtDesc();

    // Tìm các sự kiện sắp diễn ra (startDateTime >= currentDate), sắp xếp theo startDateTime tăng dần
    List<Event> findByStartDateTimeGreaterThanEqualOrderByStartDateTimeAsc(Timestamp currentDate);

    // Lấy ngẫu nhiên 10 sự kiện
    @Query(value = "SELECT * FROM events ORDER BY DBMS_RANDOM.VALUE FETCH FIRST 10 ROWS ONLY", nativeQuery = true)
    List<Event> findRandom10Events();
}
