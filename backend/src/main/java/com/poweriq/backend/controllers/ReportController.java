package com.poweriq.backend.controllers;

import com.poweriq.backend.models.TelemetryReading;
import com.poweriq.backend.repositories.TelemetryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private TelemetryRepository telemetryRepository;

    @GetMapping("/download/csv")
    public ResponseEntity<byte[]> downloadCsvReport(@RequestParam(defaultValue = "7") int days) {
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime = endTime.minusDays(days);
        
        List<TelemetryReading> readings = telemetryRepository.findByTimestampBetweenOrderByTimestampAsc(startTime, endTime);
        
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Timestamp,TotalPowerDraw(kW),ActiveDevices\\n");
        
        for (TelemetryReading reading : readings) {
            csv.append(reading.getId()).append(",")
               .append(reading.getTimestamp()).append(",")
               .append(reading.getTotalPowerDraw()).append(",")
               .append(reading.getActiveDevices()).append("\\n");
        }
        
        byte[] csvBytes = csv.toString().getBytes();
        
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=power_usage_report.csv");
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csvBytes);
    }
}