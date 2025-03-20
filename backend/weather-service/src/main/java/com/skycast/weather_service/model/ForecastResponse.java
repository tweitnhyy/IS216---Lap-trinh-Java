package com.skycast.weather_service.model;

import lombok.Data;
import java.util.List;

@Data
public class ForecastResponse {
    private List<Forecast> list;

    @Data
    public static class Forecast {
        private long dt;
        private Main main;
        private List<Weather> weather;

        @Data
        public static class Main {
            private double temp;
        }

        @Data
        public static class Weather {
            private String icon;
        }
    }
}