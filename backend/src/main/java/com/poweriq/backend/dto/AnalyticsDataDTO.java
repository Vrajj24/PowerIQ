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