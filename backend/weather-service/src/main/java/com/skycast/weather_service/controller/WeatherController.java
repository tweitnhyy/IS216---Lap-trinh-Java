package com.skycast.weather_service.controller;

import com.skycast.weather_service.dto.WeatherResponse;
import com.skycast.weather_service.service.WeatherService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*") // Cho phép frontend gọi API từ bất kỳ nguồn nào
public class WeatherController {
    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/{city}")
    public WeatherResponse getWeather(@PathVariable String city) {
        return weatherService.getWeather(city);
    }
}
