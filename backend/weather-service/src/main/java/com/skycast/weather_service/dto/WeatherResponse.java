package com.skycast.weather_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WeatherResponse {
    private String location;
    private double temperature;
    private int humidity;
    private double windSpeed;
    private String status;
    private String icon;

    public WeatherResponse(
        @JsonProperty("location") String location,
        @JsonProperty("temperature") double temperature,
        @JsonProperty("humidity") int humidity,
        @JsonProperty("windSpeed") double windSpeed,
        @JsonProperty("status") String status,
        @JsonProperty("icon") String icon
    ) {
        this.location = location;
        this.temperature = temperature;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.status = status;
        this.icon = icon;
    }

    public String getLocation() {
        return location;
    }

    public double getTemperature() {
        return temperature;
    }

    public int getHumidity() {
        return humidity;
    }

    public double getWindSpeed() {
        return windSpeed;
    }

    public String getStatus() {
        return status;
    }

    public String getIcon() {
        return icon;
    }
}
