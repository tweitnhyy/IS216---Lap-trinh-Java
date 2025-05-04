package com.example.eventory.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Events")
@Data
public class Event {

    @Id
    @Column(name = "event_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "event_seq")
    @SequenceGenerator(name = "event_seq", sequenceName = "event_seq", allocationSize = 1)
    private String eventId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "start_time", nullable = false)
    private java.sql.Timestamp startTime;

    @Column(name = "end_time", nullable = false)
    private java.sql.Timestamp endTime;

    @Column(name = "venue_id", nullable = false)
    private String venueId;

    @Column(name = "category_id", nullable = false)
    private String categoryId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "status")
    private String status;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "organizer_name")
    private String organizerName;

    @Column(name = "organizer_description")
    private String organizerDescription;

    @Column(name = "organizer_logo_url")
    private String organizerLogoUrl;
}