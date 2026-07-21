package com.poweriq.backend.controllers;

import com.poweriq.backend.dto.AnalyticsDataDTO;
import com.poweriq.backend.repositories.TelemetryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private TelemetryRepository telemetryRepository;

    @GetMapping("/historical")
    public ResponseEntity<List<AnalyticsDataDTO>> getHistoricalData(
            @RequestParam(defaultValue = "1") int days) {
        
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime = endTime.minusDays(days);
        
        List<AnalyticsDataDTO> data = telemetryRepository
            .findByTimestampBetweenOrderByTimestampAsc(startTime, endTime)
            .stream()
            .map(t -> new AnalyticsDataDTO(t.getTimestamp(), t.getTotalPowerDraw(), t.getActiveDevices()))
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(data);
    }
}