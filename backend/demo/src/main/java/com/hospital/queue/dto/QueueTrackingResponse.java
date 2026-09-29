package com.hospital.queue.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class QueueTrackingResponse {

    private Long appointmentId;
    private String tokenNumber;
    private LocalDate queueDate;
    private String status;
    private int queuePosition;
    private Integer estimatedWaitMinutes;
    private LocalDateTime estimatedConsultationTime;

    public QueueTrackingResponse(Long appointmentId, String tokenNumber,
            LocalDate queueDate, String status, int queuePosition,
            Integer estimatedWaitMinutes,
            LocalDateTime estimatedConsultationTime) {

        this.appointmentId = appointmentId;
        this.tokenNumber = tokenNumber;
        this.queueDate = queueDate;
        this.status = status;
        this.queuePosition = queuePosition;
        this.estimatedWaitMinutes = estimatedWaitMinutes;
        this.estimatedConsultationTime = estimatedConsultationTime;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public String getTokenNumber() {
        return tokenNumber;
    }

    public LocalDate getQueueDate() {
        return queueDate;
    }

    public String getStatus() {
        return status;
    }

    public int getQueuePosition() {
        return queuePosition;
    }

    public Integer getEstimatedWaitMinutes() {
        return estimatedWaitMinutes;
    }

    public LocalDateTime getEstimatedConsultationTime() {
        return estimatedConsultationTime;
    }
}