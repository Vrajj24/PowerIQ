package com.poweriq.backend.services;

import com.poweriq.backend.dto.DashboardSummaryDTO;
import com.poweriq.backend.models.TelemetryReading;
import com.poweriq.backend.repositories.DeviceRepository;
import com.poweriq.backend.repositories.TelemetryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class DashboardService {

    @Autowired
    private TelemetryRepository telemetryRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    private static final double COST_PER_KWH = 0.12;

    public DashboardSummaryDTO getSummary() {
        TelemetryReading latest = telemetryRepository.findLatestReading().orElse(null);
        
        long totalDevices = deviceRepository.count();
        
        Double currentPower = latest != null ? latest.getTotalPowerDraw() : 0.0;
        Integer activeDevices = latest != null ? latest.getActiveDevices() : 0;
        
        // Mocking daily/monthly logic based on current power since we don't have months of data yet
        Double mockDaily = currentPower * 24 * 0.6; // Assuming 60% load factor for 24h
        Double mockMonthly = mockDaily * 30;
        Double estimatedBill = mockMonthly * COST_PER_KWH;

        return new DashboardSummaryDTO(currentPower, mockDaily, mockMonthly, estimatedBill, activeDevices, (int) totalDevices);
    }
}