package com.skycast.weather_service.service;

import com.skycast.weather_service.client.WeatherClient;
import com.skycast.weather_service.client.WeatherClient.ForecastClient;
import com.skycast.weather_service.config.WeatherConfig;
import com.skycast.weather_service.model.ForecastResponse;
import com.skycast.weather_service.model.WeatherResponse;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {
    
    private final WeatherClient weatherClient;
    private final ForecastClient forecastClient;
    private final WeatherConfig weatherConfig;

    public WeatherService(WeatherClient weatherClient, ForecastClient forecastClient, WeatherConfig weatherConfig) {
        this.weatherClient = weatherClient;
        this.forecastClient = forecastClient;
        this.weatherConfig = weatherConfig;
    }

    public WeatherResponse getWeather(String location) {
        return weatherClient.getWeather(location, "metric", weatherConfig.getApiKey(), "vi");
    }
    
    public ForecastResponse getForecast(String location) {
        return forecastClient.getForecast(location, "metric", 40, weatherConfig.getApiKey(), "vi");
    }

    public String getApiKey() {
        return weatherConfig.getApiKey();
    }
}