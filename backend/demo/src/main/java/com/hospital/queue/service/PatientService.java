package com.hospital.queue.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.queue.entity.Patient;
import com.hospital.queue.repository.PatientRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public Patient addPatient(Patient patient) {
        if (patientRepository.existsByEmail(patient.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Patient not found with ID: " + id));
    }

    public Patient updatePatient(Long id, Patient updatedPatient) {
        Patient patient = getPatientById(id);

        if (!patient.getEmail().equals(updatedPatient.getEmail())
                && patientRepository.existsByEmail(updatedPatient.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        patient.setName(updatedPatient.getName());
        patient.setEmail(updatedPatient.getEmail());
        patient.setPhone(updatedPatient.getPhone());
        patient.setGender(updatedPatient.getGender());
        patient.setAge(updatedPatient.getAge());

        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        Patient patient = getPatientById(id);
        patientRepository.delete(patient);
    }
}