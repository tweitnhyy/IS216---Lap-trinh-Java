package com.example.webve.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
@Entity
@Table(name = "province")
public class Province {
    @Id
    @Column(name="province_id")
    private Integer provinceId;

    @Column(name="name")
    private String name;
}
