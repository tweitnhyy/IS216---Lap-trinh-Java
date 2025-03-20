package com.skycast.location_service.client;

import com.skycast.location_service.model.GeoNamesResponse;
import org.springframework.http.MediaType;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "geoNamesClient", url = "http://api.geonames.org")
public interface GeoNamesClient {
    
    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    GeoNamesResponse searchLocation(@RequestParam("q") String query,
                                    @RequestParam("maxRows") int maxRows,
                                    @RequestParam("username") String username);
}
