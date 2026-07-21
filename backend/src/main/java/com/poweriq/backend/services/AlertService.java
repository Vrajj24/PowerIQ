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