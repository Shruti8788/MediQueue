package com.hospital.queue.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hospital.queue.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    boolean existsByEmail(String email);
}