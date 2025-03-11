package com.skycast.weather_service.controller;

import com.skycast.weather_service.service.WeatherService;
import com.skycast.weather_service.dto.WeatherResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/weather")
public class WeatherController {
    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/{district}")
    public WeatherResponse getWeather(@PathVariable String district) {
        return weatherService.getWeatherByDistrict(district);
    }
}