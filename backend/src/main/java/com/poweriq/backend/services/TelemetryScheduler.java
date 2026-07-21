package com.poweriq.backend.services;

import com.poweriq.backend.dto.DashboardSummaryDTO;
import com.poweriq.backend.models.Device;
import com.poweriq.backend.models.TelemetryReading;
import com.poweriq.backend.repositories.DeviceRepository;
import com.poweriq.backend.repositories.TelemetryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    private DashboardService dashboardService;
    
    @Autowired
    private AlertService alertService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate = 5000)
    @Transactional
    public void captureTelemetry() {
        simulationService.simulateDeviceFluctuations();

        List<Device> devices = deviceRepository.findAll();
        double totalPower = 0.0;
        int activeCount = 0;

        for (Device device : devices) {
            if ("ONLINE".equalsIgnoreCase(device.getStatus())) {
                totalPower += device.getPowerDraw();
                activeCount++;
                
                // Process rules for alerts
                alertService.checkAndGenerateAlerts(device);
            }
        }

        TelemetryReading reading = new TelemetryReading(totalPower, activeCount, LocalDateTime.now());
        telemetryRepository.save(reading);

        DashboardSummaryDTO summary = dashboardService.getSummary();
        messagingTemplate.convertAndSend("/topic/telemetry", summary);
    }
}