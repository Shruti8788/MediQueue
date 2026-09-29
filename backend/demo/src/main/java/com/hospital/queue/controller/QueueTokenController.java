
package com.hospital.queue.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hospital.queue.entity.QueueToken;
import com.hospital.queue.service.QueueTokenService;

@RestController
@RequestMapping("/api/queue")
@CrossOrigin(origins = "http://localhost:5181")
public class QueueTokenController {

    @Autowired
    private QueueTokenService queueTokenService;

    // Generate queue token
    @PostMapping("/generate/{appointmentId}")
    public ResponseEntity<?> generateToken(
            @PathVariable Long appointmentId) {
        try {
            QueueToken token =
                    queueTokenService.generateToken(appointmentId);

            return ResponseEntity.ok(token);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all queue tokens for a particular date
    @GetMapping("/date/{date}")
    public ResponseEntity<List<QueueToken>> getTokensByDate(
            @PathVariable String date) {

        LocalDate queueDate = LocalDate.parse(date);

        return ResponseEntity.ok(
                queueTokenService.getTokensByDate(queueDate));
    }

    // Get queue token by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTokenById(
            @PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    queueTokenService.getTokenById(id));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Track patient queue using appointment ID
    @GetMapping("/track/{appointmentId}")
    public ResponseEntity<?> trackPatientQueue(
            @PathVariable Long appointmentId) {
        try {
            return ResponseEntity.ok(
                    queueTokenService.trackPatientQueue(appointmentId));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Update queue token status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTokenStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            return ResponseEntity.ok(
                    queueTokenService.updateTokenStatus(id, status));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}