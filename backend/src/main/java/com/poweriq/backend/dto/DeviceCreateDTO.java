package com.poweriq.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DeviceCreateDTO {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Type is required")
    private String type;
    
    @NotBlank(message = "Status is required")
    private String status;
    
    @NotNull(message = "Power draw is required")
    private Double powerDraw;
    
    private String roomId;
}