package com.skycast.location_service.service;

import com.skycast.location_service.client.GeoNamesClient;
import com.skycast.location_service.client.WeatherServiceClient;
import com.skycast.location_service.config.GeoNamesConfig;
import com.skycast.location_service.model.GeoNamesResponse;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    private final GeoNamesClient geoNamesClient;
    private final WeatherServiceClient weatherServiceClient;
    private final GeoNamesConfig geoNamesConfig;

    public LocationService(GeoNamesClient geoNamesClient, WeatherServiceClient weatherServiceClient, GeoNamesConfig geoNamesConfig) {
        this.geoNamesClient = geoNamesClient;
        this.weatherServiceClient = weatherServiceClient;
        this.geoNamesConfig = geoNamesConfig;
    }

    public List<String> getFilteredLocationSuggestions(String query) {
        // Lấy danh sách địa điểm từ GeoNames
        GeoNamesResponse response = geoNamesClient.searchLocation(query, 10, geoNamesConfig.getUsername());

        // Gửi danh sách này đến weather-service để lọc
        return response.getGeonames().stream()
                .map(geo -> geo.getName() + ", " + geo.getCountryName())
                .filter(weatherServiceClient::isValidLocation) // Chỉ giữ lại địa điểm hợp lệ
                .collect(Collectors.toList());
    }
}
