package com.example.webve.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Data
@Entity
@Table(name = "district")
public class District {
    @Id
    @Column(name = "district_id")
    private Integer districtId;

    @Column(name="province_id")
    private Integer provinceId;

    @Column(name="name")
    private String name;
}
