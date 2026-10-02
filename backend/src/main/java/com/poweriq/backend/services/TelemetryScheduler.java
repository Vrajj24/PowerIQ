package com.poweriq.backend.services;

import com.poweriq.backend.models.Device;
import com.poweriq.backend.models.TelemetryReading;
import com.poweriq.backend.repositories.DeviceRepository;
import com.poweriq.backend.repositories.TelemetryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class TelemetryScheduler {

    @Autowired
    private SimulationService simulationService;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private TelemetryRepository telemetryRepository;
    
    @Autowired
    private AlertService alertService;

    @Scheduled(fixedRate = 5000)
    @Transactional
    public void captureTelemetry() {
        simulationService.simulateDeviceFluctuations();

        java.util.Map<Long, List<Device>> groups = deviceRepository.findAll().stream()
            .filter(d -> d.getOwnerId() != null)
            .collect(java.util.stream.Collectors.groupingBy(Device::getOwnerId));
        for (var entry : groups.entrySet()) {
            double totalPower = entry.getValue().stream().filter(d -> "ONLINE".equalsIgnoreCase(d.getStatus()))
                .mapToDouble(d -> d.getPowerDraw() == null ? 0 : d.getPowerDraw()).sum() / 1000;
            int active = (int) entry.getValue().stream().filter(d -> "ONLINE".equalsIgnoreCase(d.getStatus())).count();
            TelemetryReading reading = new TelemetryReading(totalPower, active, LocalDateTime.now());
            reading.setOwnerId(entry.getKey());
            telemetryRepository.save(reading);
            entry.getValue().stream().filter(d -> "ONLINE".equalsIgnoreCase(d.getStatus())).forEach(alertService::checkAndGenerateAlerts);
        }
    }
}
