package com.example.eventory.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Venues")
@Data
public class Venue {

    @Id
    @Column(name = "venue_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "venue_seq")
    @SequenceGenerator(name = "venue_seq", sequenceName = "venue_seq", allocationSize = 1)
    private String venueId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "country")
    private String country;

    @Column(name = "capacity")
    private Integer capacity;
}