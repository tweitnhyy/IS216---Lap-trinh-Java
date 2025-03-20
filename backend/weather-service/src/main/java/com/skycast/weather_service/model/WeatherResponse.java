package com.skycast.weather_service.model;

import lombok.Data;

@Data
public class WeatherResponse {
    private String name;
    private Main main;
    private Wind wind;
    private Weather[] weather;

    public Main getMain() {
        return main;
    }

    public void setMain(Main main) {
        this.main = main;
    }

    @Data
    public static class Main {
        private double temp;
        private int humidity;
    }

    @Data
    public static class Wind {
        private double speed;
    }

    @Data
    public static class Weather {
        private String description;
        private String icon;
    }
}