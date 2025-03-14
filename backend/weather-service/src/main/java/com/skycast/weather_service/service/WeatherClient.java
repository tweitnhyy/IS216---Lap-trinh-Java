package com.skycast.weather_service.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "openweather", url = "https://api.openweathermap.org/data/2.5")
public interface WeatherClient {

    @GetMapping("/weather")
    String getWeather(@RequestParam("q") String location,
                      @RequestParam("appid") String apiKey,
                      @RequestParam("units") String units,
                      @RequestParam("lang") String lang);
}
