package com.poweriq.backend.services;

import com.poweriq.backend.dto.DeviceCreateDTO;
import com.poweriq.backend.dto.DeviceResponseDTO;
import com.poweriq.backend.models.Device;
import com.poweriq.backend.repositories.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    public List<DeviceResponseDTO> getAllDevices() {
        return deviceRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public DeviceResponseDTO getDeviceById(Long id) {
        Device device = deviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Device not found"));
        return mapToDTO(device);
    }

    public DeviceResponseDTO createDevice(DeviceCreateDTO dto) {
        Device device = new Device();
        device.setName(dto.getName());
        device.setType(dto.getType());
        device.setStatus(dto.getStatus());
        device.setPowerDraw(dto.getPowerDraw());
        device.setRoomId(dto.getRoomId());
        
        Device saved = deviceRepository.save(device);
        return mapToDTO(saved);
    }

    public DeviceResponseDTO updateDevice(Long id, DeviceCreateDTO dto) {
        Device device = deviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Device not found"));
        device.setName(dto.getName());
        device.setType(dto.getType());
        device.setStatus(dto.getStatus());
        device.setPowerDraw(dto.getPowerDraw());
        device.setRoomId(dto.getRoomId());
        
        Device updated = deviceRepository.save(device);
        return mapToDTO(updated);
    }

    public void deleteDevice(Long id) {
        if (!deviceRepository.existsById(id)) {
            throw new RuntimeException("Device not found");
        }
        deviceRepository.deleteById(id);
    }

    private DeviceResponseDTO mapToDTO(Device device) {
        DeviceResponseDTO dto = new DeviceResponseDTO();
        dto.setId(device.getId());
        dto.setName(device.getName());
        dto.setType(device.getType());
        dto.setStatus(device.getStatus());
        dto.setPowerDraw(device.getPowerDraw());
        dto.setRoomId(device.getRoomId());
        dto.setCreatedAt(device.getCreatedAt());
        dto.setUpdatedAt(device.getUpdatedAt());
        return dto;
    }
}