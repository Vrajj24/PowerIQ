package com.poweriq.backend.services;

import com.poweriq.backend.dto.DashboardSummaryDTO;
import com.poweriq.backend.models.Device;
import com.poweriq.backend.repositories.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DashboardService {
    @Autowired private DeviceRepository devices;
    @Autowired private AccountDataService accountData;

    public DashboardSummaryDTO getSummary() { return getSummary(accountData.currentUserId()); }

    public DashboardSummaryDTO getSummary(Long ownerId) {
        List<Device> owned = devices.findByOwnerId(ownerId);
        List<Device> active = owned.stream().filter(d -> "ONLINE".equalsIgnoreCase(d.getStatus())).toList();
        double power = active.stream().mapToDouble(d -> d.getPowerDraw() == null ? 0 : d.getPowerDraw()).sum() / 1000;
        double daily = power * 24 * 0.6;
        return new DashboardSummaryDTO(power, daily, daily * 30, daily * 30 * 8, active.size(), owned.size());
    }
}
