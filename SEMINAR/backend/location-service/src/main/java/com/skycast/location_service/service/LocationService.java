package com.skycast.location_service;

import com.skycast.location.model.Location;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    public List<Location> getAllLocations() {
        return List.of(
            new Location("District 1", "Ho Chi Minh"),
            new Location("District 2", "Ho Chi Minh"),
            new Location("District 3", "Ho Chi Minh")
        );
    }
}
