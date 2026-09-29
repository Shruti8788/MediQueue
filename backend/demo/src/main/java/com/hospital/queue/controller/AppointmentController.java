
package com.hospital.queue.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hospital.queue.entity.Appointment;
import com.hospital.queue.service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5181")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService) {

        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<?> bookAppointment(
            @RequestBody Appointment appointment) {

        try {
            Appointment saved =
                    appointmentService.bookAppointment(appointment);

            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(
            @PathVariable Long id) {

        Appointment appointment =
                appointmentService.getAppointmentById(id);

        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(appointment);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patchAppointment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        Appointment appointment =
                appointmentService.getAppointmentById(id);

        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }

        if (updates.containsKey("appointmentDate")) {
            appointment.setAppointmentDate(
                    java.time.LocalDate.parse(
                            (String) updates.get("appointmentDate")));
        }

        if (updates.containsKey("appointmentTime")) {
            appointment.setAppointmentTime(
                    java.time.LocalTime.parse(
                            (String) updates.get("appointmentTime")));
        }

        if (updates.containsKey("status")) {
            appointment.setStatus(
                    (String) updates.get("status"));
        }

        try {
            Appointment updated =
                    appointmentService.bookAppointment(appointment);

            return ResponseEntity.ok(updated);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelAppointment(
            @PathVariable Long id) {

        boolean cancelled =
                appointmentService.cancelAppointment(id);

        if (!cancelled) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}