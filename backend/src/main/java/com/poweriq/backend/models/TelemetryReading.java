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