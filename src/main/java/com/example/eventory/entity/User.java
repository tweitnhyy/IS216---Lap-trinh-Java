package com.example.eventory.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private String userId;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "role", nullable = false)
    private String role;
}