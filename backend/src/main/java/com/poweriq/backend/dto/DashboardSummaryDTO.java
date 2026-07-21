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