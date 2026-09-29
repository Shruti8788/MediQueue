
package com.hospital.queue.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class QueueToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appointmentId;

    private String tokenNumber;

    private LocalDate queueDate;

    private String status;

    private LocalDateTime createdAt;

    // New fields for waiting-time and delay tracking
    private LocalDateTime consultationStartTime;

    private LocalDateTime consultationEndTime;

    private Integer estimatedWaitMinutes;

    private LocalDateTime estimatedConsultationTime;

    public QueueToken() {
    }

    public QueueToken(Long appointmentId, String tokenNumber,
                      LocalDate queueDate, String status,
                      LocalDateTime createdAt) {
        this.appointmentId = appointmentId;
        this.tokenNumber = tokenNumber;
        this.queueDate = queueDate;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getTokenNumber() {
        return tokenNumber;
    }

    public void setTokenNumber(String tokenNumber) {
        this.tokenNumber = tokenNumber;
    }

    public LocalDate getQueueDate() {
        return queueDate;
    }

    public void setQueueDate(LocalDate queueDate) {
        this.queueDate = queueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getConsultationStartTime() {
        return consultationStartTime;
    }

    public void setConsultationStartTime(LocalDateTime consultationStartTime) {
        this.consultationStartTime = consultationStartTime;
    }

    public LocalDateTime getConsultationEndTime() {
        return consultationEndTime;
    }

    public void setConsultationEndTime(LocalDateTime consultationEndTime) {
        this.consultationEndTime = consultationEndTime;
    }

    public Integer getEstimatedWaitMinutes() {
        return estimatedWaitMinutes;
    }

    public void setEstimatedWaitMinutes(Integer estimatedWaitMinutes) {
        this.estimatedWaitMinutes = estimatedWaitMinutes;
    }

    public LocalDateTime getEstimatedConsultationTime() {
        return estimatedConsultationTime;
    }

    public void setEstimatedConsultationTime(LocalDateTime estimatedConsultationTime) {
        this.estimatedConsultationTime = estimatedConsultationTime;
    }
}