import os

base_dir = r"e:\PowerIQ\backend\src\main\java\com\poweriq\backend"

def write_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    print(f"Created {path}")

# ==================== PHASE 5 & 7: TELEMETRY & DASHBOARD ====================

write_file(r"models\TelemetryReading.java", """
package com.poweriq.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "telemetry_readings")
@Data
@NoArgsConstructor
public class TelemetryReading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double totalPowerDraw;

    @Column(nullable = false)
    private Integer activeDevices;

    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    public TelemetryReading(Double totalPowerDraw, Integer activeDevices, LocalDateTime timestamp) {
        this.totalPowerDraw = totalPowerDraw;
        this.activeDevices = activeDevices;
        this.timestamp = timestamp;
    }
}
""")

write_file(r"repositories\TelemetryRepository.java", """
package com.poweriq.backend.repositories;

import com.poweriq.backend.models.TelemetryReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TelemetryRepository extends JpaRepository<TelemetryReading, Long> {
    
    @Query("SELECT t FROM TelemetryReading t ORDER BY t.timestamp DESC LIMIT 1")
    Optional<TelemetryReading> findLatestReading();

    @Query("SELECT SUM(t.totalPowerDraw) FROM TelemetryReading t WHERE t.timestamp >= :startTime AND t.timestamp <= :endTime")
    Double sumPowerDrawBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    List<TelemetryReading> findByTimestampBetweenOrderByTimestampAsc(LocalDateTime startTime, LocalDateTime endTime);
}
""")

write_file(r"dto\DashboardSummaryDTO.java", """
package com.poweriq.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryDTO {
    private Double currentPowerDraw;
    private Double dailyUsageKwh;
    private Double monthlyUsageKwh;
    private Double estimatedBill;
    private Integer activeDevices;
    private Integer totalDevices;
}
""")

write_file(r"services\DashboardService.java", """
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
""")

write_file(r"controllers\DashboardController.java", """
package com.poweriq.backend.controllers;

import com.poweriq.backend.dto.DashboardSummaryDTO;
import com.poweriq.backend.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }
}
""")

# ==================== PHASE 8: WEBSOCKETS ====================

write_file(r"config\WebSocketConfig.java", """
package com.poweriq.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }
}
""")

# ==================== PHASE 6 & 7: SIMULATION & SCHEDULER ====================

write_file(r"services\SimulationService.java", """
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
""")

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
    private SimpMessagingTemplate messagingTemplate;

    // Run every 5 seconds
    @Scheduled(fixedRate = 5000)
    @Transactional
    public void captureTelemetry() {
        // 1. Simulate fluctuations in power draw for active devices
        simulationService.simulateDeviceFluctuations();

        // 2. Aggregate data
        List<Device> devices = deviceRepository.findAll();
        double totalPower = 0.0;
        int activeCount = 0;

        for (Device device : devices) {
            if ("ONLINE".equalsIgnoreCase(device.getStatus())) {
                totalPower += device.getPowerDraw();
                activeCount++;
            }
        }

        // 3. Save to database
        TelemetryReading reading = new TelemetryReading(totalPower, activeCount, LocalDateTime.now());
        telemetryRepository.save(reading);

        // 4. Broadcast live updates via WebSocket
        DashboardSummaryDTO summary = dashboardService.getSummary();
        messagingTemplate.convertAndSend("/topic/telemetry", summary);
    }
}
""")

write_file(r"PowerIqApplication.java", """
package com.poweriq.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PowerIqApplication {
    public static void main(String[] args) {
        SpringApplication.run(PowerIqApplication.class, args);
    }
}
""")

print("Phase 5, 6, 7, 8 files generated.")
