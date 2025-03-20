package com.skycast.weather_service.client;

import com.skycast.weather_service.model.ForecastResponse;
import com.skycast.weather_service.model.WeatherResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "openweather", url = "${weather.api.url}")
public interface WeatherClient {

    @GetMapping
    WeatherResponse getWeather(@RequestParam("q") String location,
                               @RequestParam("units") String units,
                               @RequestParam("appid") String apiKey,
                               @RequestParam("lang") String lang);  //lấy giá trị từ tham số trên URL

    @FeignClient(name = "forecast", url = "${weather.api.forecast.url}")
    interface ForecastClient {
        @GetMapping
        ForecastResponse getForecast(@RequestParam("q") String location,
                                     @RequestParam("units") String units,
                                     @RequestParam("cnt") int count,
                                     @RequestParam("appid") String apiKey,
                                     @RequestParam("lang") String lang);
    }
}