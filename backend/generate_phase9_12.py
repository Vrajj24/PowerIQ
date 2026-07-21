import os

base_dir = r"e:\PowerIQ\backend\src\main\java\com\poweriq\backend"

def write_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    print(f"Created {path}")

# ==================== PHASE 9: ADVANCED ANALYTICS ====================

write_file(r"dto\AnalyticsDataDTO.java", """
package com.poweriq.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsDataDTO {
    private LocalDateTime timestamp;
    private Double powerDraw;
    private Integer activeDevices;
}
""")

write_file(r"controllers\AnalyticsController.java", """
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
""")

# ==================== PHASE 10: REPORTS ====================

write_file(r"controllers\ReportController.java", """
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
        csv.append("ID,Timestamp,TotalPowerDraw(kW),ActiveDevices\n");
        
        for (TelemetryReading reading : readings) {
            csv.append(reading.getId()).append(",")
               .append(reading.getTimestamp()).append(",")
               .append(reading.getTotalPowerDraw()).append(",")
               .append(reading.getActiveDevices()).append("\n");
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
""")

# ==================== PHASE 11: ALERT ENGINE ====================

write_file(r"models\Alert.java", """
package com.poweriq.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // e.g. WARNING, CRITICAL
    private String message;
    private String deviceName;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    private boolean isRead = false;
    
    public Alert(String type, String message, String deviceName, LocalDateTime createdAt) {
        this.type = type;
        this.message = message;
        this.deviceName = deviceName;
        this.createdAt = createdAt;
    }
}
""")

write_file(r"repositories\AlertRepository.java", """
package com.poweriq.backend.repositories;

import com.poweriq.backend.models.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByIsReadFalseOrderByCreatedAtDesc();
}
""")

write_file(r"services\AlertService.java", """
package com.poweriq.backend.services;

import com.poweriq.backend.models.Alert;
import com.poweriq.backend.models.Device;
import com.poweriq.backend.repositories.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void checkAndGenerateAlerts(Device device) {
        // Simple rule: If HVAC draws > 4.0 kW, generate a warning alert
        if ("HVAC".equalsIgnoreCase(device.getType()) && device.getPowerDraw() > 4.0) {
            String message = "High power consumption detected for HVAC system: " + String.format("%.2f", device.getPowerDraw()) + " kW";
            Alert alert = new Alert("WARNING", message, device.getName(), LocalDateTime.now());
            alertRepository.save(alert);
            
            // Broadcast alert over websocket
            messagingTemplate.convertAndSend("/topic/alerts", alert);
        }
    }
    
    public List<Alert> getUnreadAlerts() {
        return alertRepository.findByIsReadFalseOrderByCreatedAtDesc();
    }
}
""")

# We need to inject AlertService into TelemetryScheduler to process alerts
write_file(r"services\TelemetryScheduler.java", """
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
""")

write_file(r"controllers\AlertController.java", """
package com.poweriq.backend.controllers;

import com.poweriq.backend.models.Alert;
import com.poweriq.backend.services.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping
    public ResponseEntity<List<Alert>> getUnreadAlerts() {
        return ResponseEntity.ok(alertService.getUnreadAlerts());
    }
}
""")

print("Phase 9, 10, 11 files generated.")

# ==================== PHASE 12: DOCKERIZATION ====================

dockerfile_path = os.path.join(r"e:\PowerIQ\backend", "Dockerfile")
with open(dockerfile_path, 'w', encoding='utf-8') as f:
    f.write("""
# Build stage
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
""")
print("Phase 12 Dockerfile generated.")
