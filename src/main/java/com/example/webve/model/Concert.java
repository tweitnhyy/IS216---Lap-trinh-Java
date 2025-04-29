package com.example.webve.model;

import jakarta.persistence.*;

@Entity
@Table(name = "concerts") // Cách 1: thêm rõ ràng tên bảng
public class Concert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String artist;

    @Column(nullable = false)
    private String venue;

    @Column(nullable = false)
    private String date;
    @Column(nullable = false)
    private String location;


    public Concert() {
        // Default constructor
    }

    public Concert(String name, String artist, String venue, String date,String location) {
        this.name = name;
        this.artist = artist;
        this.venue = venue;
        this.date = date;
        this.location = location;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    @Override
    public String toString() {
        return "Concert{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", artist='" + artist + '\'' +
                ", venue='" + venue + '\'' +
                ", date='" + date + '\'' +
                
                '}';
    }
}
