package com.poweriq.backend.repositories;

import com.poweriq.backend.models.TelemetryReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TelemetryRepository extends JpaRepository<TelemetryReading, Long> {
    
    @Query("SELECT t FROM TelemetryReading t ORDER BY t.timestamp DESC LIMIT 1")
    Optional<TelemetryReading> findLatestReading();

    @Query("SELECT SUM(t.totalPowerDraw) FROM TelemetryReading t WHERE t.timestamp >= :startTime AND t.timestamp <= :endTime")
    Double sumPowerDrawBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    List<TelemetryReading> findByTimestampBetweenOrderByTimestampAsc(LocalDateTime startTime, LocalDateTime endTime);
}