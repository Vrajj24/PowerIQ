package com.poweriq.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PowerIqBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PowerIqBackendApplication.class, args);
	}

}
