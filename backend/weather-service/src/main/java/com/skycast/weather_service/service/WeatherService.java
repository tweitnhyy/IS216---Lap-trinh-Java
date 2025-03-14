package com.skycast.weather_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skycast.weather_service.config.WeatherConfig;
import com.skycast.weather_service.dto.WeatherResponse;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {
    private final WeatherClient weatherClient;
    private final WeatherConfig weatherConfig;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public WeatherService(WeatherClient weatherClient, WeatherConfig weatherConfig) {
        this.weatherClient = weatherClient;
        this.weatherConfig = weatherConfig;
    }

    public WeatherResponse getWeather(String city) {
        try {
            // Gọi API từ OpenWeather
            String response = weatherClient.getWeather(city, weatherConfig.getKey(), "metric", "vi");

            // Parse JSON từ API
            JsonNode root = objectMapper.readTree(response);
            String location = root.path("name").asText();
            double temperature = root.path("main").path("temp").asDouble();
            int humidity = root.path("main").path("humidity").asInt();
            double windSpeed = root.path("wind").path("speed").asDouble();
            String status = root.path("weather").get(0).path("description").asText();
            String icon = root.path("weather").get(0).path("icon").asText();

            // Tạo và trả về kết quả
            return new WeatherResponse(location, temperature, humidity, windSpeed, status,
                    "https://openweathermap.org/img/wn/" + icon + ".png");

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi gọi OpenWeather API", e);
        }
    }
}
