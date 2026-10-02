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
                double basePower = device.getPowerDraw() == null || device.getPowerDraw() <= 0
                    ? getBasePowerForType(device.getType()) : device.getPowerDraw();
                // Fluctuate by +/- 10%
                double fluctuation = basePower * 0.1 * (random.nextDouble() * 2 - 1);
                device.setPowerDraw(Math.max(0, basePower + fluctuation));
            }
            deviceRepository.save(device);
        }
    }

    private double getBasePowerForType(String type) {
        return switch (type.toUpperCase()) {
            case "HVAC" -> 2000;
            case "LIGHTING" -> 15;
            case "SERVER" -> 1500;
            case "APPLIANCE" -> 800;
            default -> 500;
        };
    }
}