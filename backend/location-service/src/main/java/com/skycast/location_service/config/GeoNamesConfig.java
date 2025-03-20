package com.skycast.location_service.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "geonames.api")
public class GeoNamesConfig {
    private String url;
    private String username;

    // Constructor mặc định
    public GeoNamesConfig() {}

    // Getter & Setter cho url
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    // Getter & Setter cho username
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
