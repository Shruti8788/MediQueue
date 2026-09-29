
package com.hospital.queue.service;

import com.hospital.queue.dto.QueueTrackingResponse;
import com.hospital.queue.entity.Appointment;
import com.hospital.queue.entity.QueueToken;
import com.hospital.queue.repository.AppointmentRepository;
import com.hospital.queue.repository.QueueTokenRepository;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QueueTokenService {

    private static final int DEFAULT_CONSULTATION_MINUTES = 15;

    @Autowired
    private QueueTokenRepository queueTokenRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public QueueToken generateToken(Long appointmentId) {

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Appointment not found"));

        if (!"BOOKED".equals(appointment.getStatus())) {
            throw new IllegalArgumentException(
                    "Token can only be generated for booked appointments");
        }

        if (queueTokenRepository.existsByAppointmentId(appointmentId)) {
            throw new IllegalArgumentException(
                    "Token already exists for this appointment");
        }

        LocalDate queueDate = appointment.getAppointmentDate();

        List<QueueToken> tokens =
                queueTokenRepository.findByQueueDateOrderByIdAsc(queueDate);

        int nextNumber = tokens.size() + 1;

        String tokenNumber = String.format("A-%03d", nextNumber);

        QueueToken token = new QueueToken(
                appointmentId,
                tokenNumber,
                queueDate,
                "WAITING",
                LocalDateTime.now()
        );

        QueueToken savedToken = queueTokenRepository.save(token);

        calculateWaitingTimes(queueDate);

        return savedToken;
    }

    public List<QueueToken> getTokensByDate(LocalDate date) {

        calculateWaitingTimes(date);

        return queueTokenRepository
                .findByQueueDateOrderByIdAsc(date);
    }

    public QueueToken getTokenById(Long id) {

        return queueTokenRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Queue token not found"));
    }

    public QueueToken updateTokenStatus(Long id, String status) {

        QueueToken token = getTokenById(id);

        if (!List.of("WAITING", "IN_PROGRESS", "COMPLETED", "CANCELLED")
                .contains(status)) {

            throw new IllegalArgumentException("Invalid queue status");
        }

        if ("COMPLETED".equals(token.getStatus())
                || "CANCELLED".equals(token.getStatus())) {

            throw new IllegalArgumentException(
                    "Cannot change a completed or cancelled token");
        }

        LocalDateTime now = LocalDateTime.now();

        if ("IN_PROGRESS".equals(status)) {
            token.setConsultationStartTime(now);
        }

        if ("COMPLETED".equals(status)) {

            if (token.getConsultationStartTime() == null) {
                throw new IllegalArgumentException(
                        "Patient consultation has not started");
            }

            token.setConsultationEndTime(now);
        }

        token.setStatus(status);

        QueueToken updatedToken = queueTokenRepository.save(token);

        calculateWaitingTimes(token.getQueueDate());

        return updatedToken;
    }

    public void calculateWaitingTimes(LocalDate date) {

        List<QueueToken> tokens =
                queueTokenRepository.findByQueueDateOrderByIdAsc(date);

        LocalDateTime now = LocalDateTime.now();

        int consultationMinutes = getAverageConsultationMinutes(tokens);

        LocalDateTime estimatedTime = now;

        // Account for the patient currently being consulted.
        for (QueueToken token : tokens) {

            if ("IN_PROGRESS".equals(token.getStatus())) {

                LocalDateTime startTime =
                        token.getConsultationStartTime();

                if (startTime != null) {

                    LocalDateTime expectedEnd =
                            startTime.plusMinutes(consultationMinutes);

                    if (expectedEnd.isAfter(estimatedTime)) {
                        estimatedTime = expectedEnd;
                    }

                } else {

                    estimatedTime = estimatedTime.plusMinutes(
                            consultationMinutes);
                }
            }
        }

        // Estimate the waiting time for each patient in queue.
        for (QueueToken token : tokens) {

            if ("WAITING".equals(token.getStatus())) {

                // Get the appointment's scheduled date and time.
                Appointment appointment = appointmentRepository
                        .findById(token.getAppointmentId())
                        .orElse(null);

                if (appointment != null
                        && appointment.getAppointmentDate() != null
                        && appointment.getAppointmentTime() != null) {

                    LocalDateTime scheduledTime = LocalDateTime.of(
                            appointment.getAppointmentDate(),
                            appointment.getAppointmentTime()
                    );

                    // Do not estimate this patient before their
                    // scheduled appointment time.
                    if (scheduledTime.isAfter(estimatedTime)) {
                        estimatedTime = scheduledTime;
                    }
                }

                long waitMinutes = Math.max(
                        0,
                        Duration.between(now, estimatedTime).toMinutes()
                );

                token.setEstimatedWaitMinutes((int) waitMinutes);
                token.setEstimatedConsultationTime(estimatedTime);

                estimatedTime = estimatedTime.plusMinutes(
                        consultationMinutes);

                queueTokenRepository.save(token);
            }

            if ("IN_PROGRESS".equals(token.getStatus())) {

                token.setEstimatedWaitMinutes(0);
                token.setEstimatedConsultationTime(now);

                queueTokenRepository.save(token);
            }
        }
    }

    private int getAverageConsultationMinutes(List<QueueToken> tokens) {

        long totalMinutes = 0;
        int completedCount = 0;

        for (QueueToken token : tokens) {

            if ("COMPLETED".equals(token.getStatus())
                    && token.getConsultationStartTime() != null
                    && token.getConsultationEndTime() != null) {

                long minutes = Duration.between(
                        token.getConsultationStartTime(),
                        token.getConsultationEndTime()
                ).toMinutes();

                if (minutes > 0) {
                    totalMinutes += minutes;
                    completedCount++;
                }
            }
        }

        if (completedCount == 0) {
            return DEFAULT_CONSULTATION_MINUTES;
        }

        return Math.max(
                1,
                (int) Math.ceil(
                        (double) totalMinutes / completedCount
                )
        );
    }

    public QueueTrackingResponse trackPatientQueue(Long appointmentId) {

        QueueToken token = queueTokenRepository
                .findByAppointmentId(appointmentId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Queue token not found for this appointment"));

        calculateWaitingTimes(token.getQueueDate());

        token = queueTokenRepository
                .findByAppointmentId(appointmentId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Queue token not found"));

        int queuePosition = 0;

        if ("WAITING".equals(token.getStatus())
                || "IN_PROGRESS".equals(token.getStatus())) {

            List<QueueToken> tokens = queueTokenRepository
                    .findByQueueDateOrderByIdAsc(token.getQueueDate());

            int position = 0;

            for (QueueToken queueToken : tokens) {

                if ("WAITING".equals(queueToken.getStatus())
                        || "IN_PROGRESS".equals(queueToken.getStatus())) {

                    position++;

                    if (queueToken.getId().equals(token.getId())) {
                        queuePosition = position;
                        break;
                    }
                }
            }
        }

        return new QueueTrackingResponse(
                appointmentId,
                token.getTokenNumber(),
                token.getQueueDate(),
                token.getStatus(),
                queuePosition,
                token.getEstimatedWaitMinutes(),
                token.getEstimatedConsultationTime()
        );
    }
}