package com.poweriq.backend;

import com.poweriq.backend.dto.DeviceCreateDTO;
import com.poweriq.backend.models.User;
import com.poweriq.backend.repositories.UserRepository;
import com.poweriq.backend.repositories.TelemetryRepository;
import com.poweriq.backend.services.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AccountDataTests {
    @Autowired UserRepository users;
    @Autowired DeviceService devices;
    @Autowired DashboardService dashboard;
    @Autowired AccountDataService accounts;
    @Autowired TelemetryScheduler scheduler;
    @Autowired TelemetryRepository telemetry;
    @Autowired AlertService alerts;

    private User user(boolean initialized) {
        User user = new User();
        user.setEmail(UUID.randomUUID() + "@example.com"); user.setPassword("test-password");
        user.setName("Test"); user.setRole("USER"); user.setDataInitialized(initialized ? true : null);
        return users.save(user);
    }
    private void login(User user) {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(user.getEmail(), "", List.of()));
    }
    @AfterEach void logout() { SecurityContextHolder.clearContext(); }

    @Test void newAccountsStayEmptyAndDevicesGenerateOnlyTheirOwnReadings() {
        User first = user(true), second = user(true);
        accounts.initializeExisting(first);
        login(first);
        assertTrue(devices.getAllDevices().isEmpty());
        assertEquals(0.0, dashboard.getSummary().getCurrentPowerDraw());
        assertEquals(0, dashboard.getSummary().getTotalDevices());
        assertTrue(alerts.getUnreadAlerts().isEmpty());
        DeviceCreateDTO request = new DeviceCreateDTO();
        request.setName("Fan"); request.setType("Climate"); request.setStatus("ONLINE"); request.setPowerDraw(75.0); request.setRoomId("Bedroom");
        Long id = devices.createDevice(request).getId();
        assertEquals(0.075, dashboard.getSummary().getCurrentPowerDraw(), 0.0001);
        scheduler.captureTelemetry();
        var readings = telemetry.findByOwnerIdAndTimestampBetweenOrderByTimestampAsc(first.getId(), LocalDateTime.now().minusMinutes(1), LocalDateTime.now().plusMinutes(1));
        assertFalse(readings.isEmpty());
        assertTrue(readings.get(readings.size() - 1).getTotalPowerDraw() > 0);
        login(second);
        assertTrue(devices.getAllDevices().isEmpty());
        assertEquals(0.0, dashboard.getSummary().getCurrentPowerDraw());
        assertThrows(ResponseStatusException.class, () -> devices.getDeviceById(id));
        assertThrows(ResponseStatusException.class, () -> devices.updateDevice(id, request));
        assertThrows(ResponseStatusException.class, () -> devices.deleteDevice(id));
        assertTrue(telemetry.findByOwnerIdAndTimestampBetweenOrderByTimestampAsc(second.getId(), LocalDateTime.now().minusDays(30), LocalDateTime.now().plusMinutes(1)).isEmpty());
        login(first);
        request.setStatus("OFFLINE"); devices.updateDevice(id, request);
        assertEquals(0.0, dashboard.getSummary().getCurrentPowerDraw());
        devices.deleteDevice(id);
        assertEquals(0, dashboard.getSummary().getTotalDevices());
        assertEquals(0.0, dashboard.getSummary().getDailyUsageKwh());
    }

    @Test void existingAccountsGetMockHistoryOnlyOnceAndKeepDeletedDevicesDeleted() {
        User existing = user(false);
        accounts.initializeExisting(existing); login(existing);
        assertFalse(devices.getAllDevices().isEmpty());
        var from = LocalDateTime.now().minusDays(31); var to = LocalDateTime.now().plusMinutes(1);
        int count = telemetry.findByOwnerIdAndTimestampBetweenOrderByTimestampAsc(existing.getId(), from, to).size();
        assertTrue(count >= 721);
        var owned = devices.getAllDevices();
        owned.forEach(d -> devices.deleteDevice(d.getId()));
        accounts.initializeExisting(existing);
        assertTrue(devices.getAllDevices().isEmpty());
        assertEquals(count, telemetry.findByOwnerIdAndTimestampBetweenOrderByTimestampAsc(existing.getId(), from, to).size());
    }
}

