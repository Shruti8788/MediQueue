
package com.hospital.queue.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hospital.queue.entity.Doctor;

public interface DoctorRepository
        extends JpaRepository<Doctor, Long> {
}