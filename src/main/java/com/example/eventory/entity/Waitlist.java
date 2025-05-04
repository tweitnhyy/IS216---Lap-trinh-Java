package com.example.eventory.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Waitlist")
@Data
public class Waitlist {

    @Id
    @Column(name = "waitlist_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "waitlist_seq")
    @SequenceGenerator(name = "waitlist_seq", sequenceName = "waitlist_seq", allocationSize = 1)
    private String waitlistId;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "name")
    private String name;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "submitted_at")
    private java.sql.Timestamp submittedAt;

    @Column(name = "reviewed_at")
    private java.sql.Timestamp reviewedAt;

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "comments")
    private String comments;
}