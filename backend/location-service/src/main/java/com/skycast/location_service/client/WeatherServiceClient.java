package com.skycast.location_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "weather-service", url = "http://localhost:8080")
public interface WeatherServiceClient {

    @GetMapping("/api/weather/validate")
    boolean isValidLocation(@RequestParam("location") String location);
}
