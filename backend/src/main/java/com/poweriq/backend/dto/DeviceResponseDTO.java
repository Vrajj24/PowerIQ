package com.poweriq.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DeviceResponseDTO {
    private Long id;
    private String name;
    private String type;
    private String status;
    private Double powerDraw;
    private String roomId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}