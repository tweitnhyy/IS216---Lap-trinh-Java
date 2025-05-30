package com.example.webve.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;


    @Getter
    @Setter
    @Entity
    @Table(name = "Events")
    public class Event {

        @Id
        @Column(name = "event_id")
        private String eventId;

        @Column(name = "title", nullable = false)
        private String title;

        @Column(name = "format")
        private String format; // Hình thức sự kiện (offline/online)

        @Column(name = "city", nullable = false)
        private String city;    // Tỉnh/Thành để truy vấn

        @Column(name = "poster")
        private String poster;

        @Column(name = "poster_sub")
        private String posterSub;

        @Column(name = "video")
        private String video;

        @Column(name = "description", columnDefinition = "CLOB")
        private String description; // Gộp mô tả sự kiện và sơ đồ chỗ ngồi

        @Column(name = "start_date_time")
        private Timestamp startDateTime;

        @Column(name = "end_date_time")
        private Timestamp endDateTime;

        @Column(name = "location")
        private String location;  // Gộp số nhà, đường, phường/xã, quận/huyện, tên địa điểm

        @Column(name = "ticket_sale_start")
        private Date ticketSaleStart;

        @Column(name = "ticket_sale_end")
        private Date ticketSaleEnd;

        @Column(name = "organizer_name")
        private String organizerName;

        @Column(name = "organizer_logo")
        private String organizerLogo;

        @Column(name = "created_at", updatable = false)
        private Timestamp createdAt;

        @Column(name = "updated_at")
        private Timestamp updatedAt;

        @Column(name = "organizer_description", columnDefinition = "CLOB")
        private String organizerDescription;

        @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
        private List<TicketType> ticketTypes;

        @PrePersist
        protected void onCreate() {
            createdAt = new Timestamp(System.currentTimeMillis());
            updatedAt = new Timestamp(System.currentTimeMillis());
        }

        @PreUpdate
        protected void onUpdate() {
            updatedAt = new Timestamp(System.currentTimeMillis());
        }
    }

