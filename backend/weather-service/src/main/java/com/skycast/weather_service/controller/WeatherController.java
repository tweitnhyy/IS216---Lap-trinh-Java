package com.skycast.weather_service.controller;

import com.skycast.weather_service.model.ForecastResponse;
import com.skycast.weather_service.model.WeatherResponse;
import com.skycast.weather_service.service.WeatherService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin("*")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/today")
    public WeatherResponse getWeather(@RequestParam String location) {
        return weatherService.getWeather(location);
    }

    @GetMapping("/forecast")
    public ForecastResponse getForecast(@RequestParam String location) {
        return weatherService.getForecast(location);
    }

    // Duyệt địa điểm
    @GetMapping("/validate")
    public boolean isValidLocation(@RequestParam String location) {
        try {
            WeatherResponse response = weatherService.getWeather(location);
            return response != null && response.getMain() != null;
        } catch (Exception e) {
            return false;
        }
    }

}
