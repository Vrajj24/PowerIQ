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