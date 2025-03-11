package com.skycast.weather_service.service;

import com.skycast.weather_service.dto.WeatherResponse;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class WeatherService {
    private static final String[] CONDITIONS = {"Sunny", "Rainy", "Cloudy", "Stormy"};

    public WeatherResponse getWeatherByDistrict(String district) {
        Random random = new Random();
        int temperature = random.nextInt(10) + 25; // Nhiệt độ từ 25 - 35 độ C
        String condition = CONDITIONS[random.nextInt(CONDITIONS.length)];
        return new WeatherResponse(district, temperature, condition);
    }
}