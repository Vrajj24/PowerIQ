package com.poweriq.backend;

import com.poweriq.backend.models.Device;
import com.poweriq.backend.models.TelemetryReading;
import com.poweriq.backend.repositories.DeviceRepository;
import com.poweriq.backend.repositories.TelemetryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DeviceRepository deviceRepository;
    private final TelemetryRepository telemetryRepository;

    public DataInitializer(DeviceRepository deviceRepository, TelemetryRepository telemetryRepository) {
        this.deviceRepository = deviceRepository;
        this.telemetryRepository = telemetryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (deviceRepository.count() == 0) {
            System.out.println("Generating initial mock devices...");
            deviceRepository.save(new Device(null, "HVAC System", "HVAC", "ONLINE", 1800.0, "Living Room", null, null));
            deviceRepository.save(new Device(null, "Smart Fridge", "Appliance", "ONLINE", 300.0, "Kitchen", null, null));
            deviceRepository.save(new Device(null, "Ceiling Fan", "Climate", "ONLINE", 75.0, "Master Bedroom", null, null));
            deviceRepository.save(new Device(null, "Water Heater", "Utility", "ONLINE", 2500.0, "Bathroom", null, null));
            deviceRepository.save(new Device(null, "OLED TV", "Entertainment", "OFFLINE", 150.0, "Living Room", null, null));
            deviceRepository.save(new Device(null, "Washing Machine", "Appliance", "OFFLINE", 650.0, "Laundry Room", null, null));
            deviceRepository.save(new Device(null, "Microwave", "Appliance", "OFFLINE", 1200.0, "Kitchen", null, null));
            deviceRepository.save(new Device(null, "LED Lights", "Lighting", "ONLINE", 120.0, "Kitchen", null, null));
        }

        if (telemetryRepository.count() < 100) {
            System.out.println("Generating historical telemetry data...");
            LocalDateTime now = LocalDateTime.now();
            // Generate data for the past 30 days
            for (int i = 30; i >= 0; i--) {
                double dailyUsage = 20 + (Math.random() * 15); // Random daily usage between 20 and 35
                telemetryRepository.save(new TelemetryReading(dailyUsage, 4, now.minusDays(i)));
            }
        }
    }
}
