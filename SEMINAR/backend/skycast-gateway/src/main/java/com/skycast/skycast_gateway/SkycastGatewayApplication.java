package com.skycast.skycast_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SkycastGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkycastGatewayApplication.class, args);
    }

    // Cấu hình route để định tuyến request đến các microservices
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("location-service", r -> r.path("/api/location/**")
                        .uri("http://localhost:8081")) // Đổi port theo service của bạn
                .route("weather-service", r -> r.path("/api/weather/**")
                        .uri("http://localhost:8082"))
                .build();
    }
}
