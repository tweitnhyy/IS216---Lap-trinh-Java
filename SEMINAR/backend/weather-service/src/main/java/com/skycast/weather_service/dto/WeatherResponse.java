package com.skycast.weather_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor // Constructor không tham số
@AllArgsConstructor // Constructor có tham số (district, temperature, condition)
public class WeatherResponse {
    private String district;
    private int temperature;
    private String condition;
}
