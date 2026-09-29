package com.hospital.queue.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hospital.queue.entity.Doctor;
import com.hospital.queue.service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5181")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor) {
        Doctor saved = doctorService.addDoctor(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        Doctor doctor = doctorService.getDoctorById(id);

        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(doctor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(
            @PathVariable Long id,
            @RequestBody Doctor doctor) {

        Doctor updated = doctorService.updateDoctor(id, doctor);

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Doctor> patchDoctor(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        Doctor doctor = doctorService.getDoctorById(id);

        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }

        if (updates.containsKey("name")) {
            doctor.setName((String) updates.get("name"));
        }

        if (updates.containsKey("specialization")) {
            doctor.setSpecialization((String) updates.get("specialization"));
        }

        if (updates.containsKey("email")) {
            doctor.setEmail((String) updates.get("email"));
        }

        if (updates.containsKey("phone")) {
            doctor.setPhone((String) updates.get("phone"));
        }

        Doctor updated = doctorService.updateDoctor(id, doctor);

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        boolean deleted = doctorService.deleteDoctor(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}