package com.skycast.location_service.controller;

import com.skycast.location_service.service.LocationService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin("*")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/suggest")
    public List<String> suggestLocations(@RequestParam String query) {
        return locationService.getFilteredLocationSuggestions(query);
    }
}
