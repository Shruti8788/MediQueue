package com.hospital.queue.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hospital.queue.entity.Patient;
import com.hospital.queue.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5176")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public ResponseEntity<Patient> addPatient(
            @Valid @RequestBody Patient patient) {

        return new ResponseEntity<>(
                patientService.addPatient(patient),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody Patient patient) {

        return ResponseEntity.ok(
                patientService.updatePatient(id, patient));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Patient> patchPatient(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        Patient patient = patientService.getPatientById(id);

        if (updates.containsKey("name")) {
            patient.setName((String) updates.get("name"));
        }

        if (updates.containsKey("email")) {
            patient.setEmail((String) updates.get("email"));
        }

        if (updates.containsKey("phone")) {
            patient.setPhone((String) updates.get("phone"));
        }

        if (updates.containsKey("gender")) {
            patient.setGender((String) updates.get("gender"));
        }

        if (updates.containsKey("age")) {
            patient.setAge(((Number) updates.get("age")).intValue());
        }

        return ResponseEntity.ok(
                patientService.updatePatient(id, patient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok("Patient deleted successfully");
    }
}