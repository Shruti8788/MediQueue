
package com.hospital.queue.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.queue.entity.QueueToken;

public interface QueueTokenRepository extends JpaRepository<QueueToken, Long> {

    List<QueueToken> findByQueueDateOrderByIdAsc(LocalDate queueDate);

    boolean existsByAppointmentId(Long appointmentId);

    List<QueueToken> findByQueueDateAndStatusOrderByIdAsc(
            LocalDate queueDate, String status);

    List<QueueToken> findByQueueDateAndStatusInOrderByIdAsc(
            LocalDate queueDate, List<String> statuses);

    
    Optional<QueueToken> findByAppointmentId(Long appointmentId);
}