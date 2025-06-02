package com.example.webve.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
@Entity
@Table(name = "wards")
public class Ward {
    @Id
    @Column(name = "wards_id")
    private Integer wardId;

    @Column(name = "district_id")
    private Integer districtId;

    @Column(name="name")
    private String name;
}
