package com.example.eventory.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Categories")
@Data
public class Category {

    @Id
    @Column(name = "category_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "category_seq")
    @SequenceGenerator(name = "category_seq", sequenceName = "category_seq", allocationSize = 1)
    private String categoryId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;
}