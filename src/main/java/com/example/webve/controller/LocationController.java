package com.example.webve.controller;

import com.example.webve.model.District;
import com.example.webve.model.Province;
import com.example.webve.model.Ward;
import com.example.webve.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/location")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping("/provinces")
    public ResponseEntity<List<Province>> getAllProvinces() {
        List<Province> provinces = locationService.getAllProvinces();
        System.out.println("Returning " + provinces.size() + " provinces: " + provinces);
        return ResponseEntity.ok(provinces);
    }

    @GetMapping("/districts")
    public ResponseEntity<List<District>> getDistrictsByProvinceId(@RequestParam Integer provinceId) {
        List<District> districts = locationService.getDistrictsByProvinceId(provinceId);
        return ResponseEntity.ok(districts);
    }

    @GetMapping("/wards")
    public ResponseEntity<List<Ward>> getWardsByDistrictId(@RequestParam Integer districtId) {
        List<Ward> wards = locationService.getWardsByDistrictId(districtId);
        return ResponseEntity.ok(wards);
    }
}
