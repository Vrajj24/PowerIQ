package com.poweriq.backend.repositories;

import com.poweriq.backend.models.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    java.util.List<Device> findByOwnerId(Long ownerId);
    java.util.Optional<Device> findByIdAndOwnerId(Long id, Long ownerId);
}
