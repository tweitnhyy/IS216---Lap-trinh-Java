package com.skycast.location_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@ConfigurationPropertiesScan("com.skycast.location_service.config")
@EnableFeignClients
public class LocationServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(LocationServiceApplication.class, args);
	}

}
