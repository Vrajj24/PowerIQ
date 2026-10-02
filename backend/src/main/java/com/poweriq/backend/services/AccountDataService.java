package com.poweriq.backend.services;

import com.poweriq.backend.models.*;
import com.poweriq.backend.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccountDataService {
    private final UserRepository users;
    private final DeviceRepository devices;
    private final TelemetryRepository telemetry;
    public AccountDataService(UserRepository users, DeviceRepository devices, TelemetryRepository telemetry) {
        this.users=users; this.devices=devices; this.telemetry=telemetry;
    }
    public Long currentUserId() {
        return users.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow().getId();
    }
    @Transactional
    public void initializeExisting(User user) {
        if (Boolean.TRUE.equals(user.getDataInitialized())) return;
        if (devices.findByOwnerId(user.getId()).isEmpty()) {
            List<Device> legacy = devices.findAll().stream().filter(d -> d.getOwnerId() == null).toList();
            if (legacy.isEmpty()) {
                legacy = List.of(sample("Air Conditioner", "HVAC", 2000, "Living Room"),
                    sample("Smart Refrigerator", "Refrigerator", 150, "Kitchen"),
                    sample("Ceiling Fan", "Climate", 75, "Bedroom"), sample("LED Lights", "Lighting", 15, "Kitchen"));
            }
            for (Device old : legacy) {
                Device copy = sample(old.getName(), old.getType(), old.getPowerDraw() == null ? 0 : old.getPowerDraw(), old.getRoomId());
                copy.setStatus(old.getStatus()); copy.setOwnerId(user.getId()); devices.save(copy);
            }
        }
        List<Device> owned = devices.findByOwnerId(user.getId());
        double load = owned.stream().filter(d -> "ONLINE".equalsIgnoreCase(d.getStatus())).mapToDouble(d -> d.getPowerDraw() == null ? 0 : d.getPowerDraw()).sum()/1000;
        int active = (int) owned.stream().filter(d -> "ONLINE".equalsIgnoreCase(d.getStatus())).count();
        LocalDateTime now = LocalDateTime.now();
        for (int hour=30*24; hour>=0; hour--) {
            TelemetryReading reading = new TelemetryReading(load*(0.6+0.4*Math.sin(hour*0.3)*Math.sin(hour*0.3)), active, now.minusHours(hour));
            reading.setOwnerId(user.getId()); telemetry.save(reading);
        }
        user.setDataInitialized(true); users.save(user);
    }
    private Device sample(String name, String type, double watts, String room) {
        Device device=new Device(); device.setName(name); device.setType(type); device.setPowerDraw(watts);
        device.setRoomId(room); device.setStatus("ONLINE"); return device;
    }
}
