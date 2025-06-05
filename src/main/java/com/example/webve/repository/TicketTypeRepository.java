package com.example.webve.repository;

import com.example.webve.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TicketTypeRepository extends JpaRepository<TicketType, String> {
    @Query("SELECT t FROM TicketType t WHERE t.event.eventId = :eventId AND t.type = :type")
    Optional<TicketType> findByEventEventIdAndType(@Param("eventId") String eventId, @Param("type") String type);
}