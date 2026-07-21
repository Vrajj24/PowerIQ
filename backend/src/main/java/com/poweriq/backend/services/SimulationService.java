package com.poweriq.backend.services;

import com.poweriq.backend.models.Device;
import com.poweriq.backend.repositories.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
public class SimulationService {

    @Autowired
    private DeviceRepository deviceRepository;

    private final Random random = new Random();

    @Transactional
    public void simulateDeviceFluctuations() {
        List<Device> devices = deviceRepository.findAll();
        
        for (Device device : devices) {
            if ("ONLINE".equalsIgnoreCase(device.getStatus())) {
                double basePower = getBasePowerForType(device.getType());
                // Fluctuate by +/- 10%
                double fluctuation = basePower * 0.1 * (random.nextDouble() * 2 - 1);
                device.setPowerDraw(Math.max(0, basePower + fluctuation));
            } else {
                device.setPowerDraw(0.0);
            }
            deviceRepository.save(device);
        }
    }

    private double getBasePowerForType(String type) {
        return switch (type.toUpperCase()) {
            case "HVAC" -> 3.5;
            case "LIGHTING" -> 0.2;
            case "SERVER" -> 1.5;
            case "APPLIANCE" -> 0.8;
            default -> 0.5;
        };
    }
}