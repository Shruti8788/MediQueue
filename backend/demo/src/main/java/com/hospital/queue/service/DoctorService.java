
package com.hospital.queue.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.queue.entity.Doctor;
import com.hospital.queue.repository.DoctorRepository;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id).orElse(null);
    }

    public Doctor updateDoctor(Long id, Doctor doctor) {
        Doctor existing = doctorRepository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setName(doctor.getName());
        existing.setSpecialization(doctor.getSpecialization());
        existing.setEmail(doctor.getEmail());
        existing.setPhone(doctor.getPhone());
        existing.setAvailability(doctor.getAvailability());

        return doctorRepository.save(existing);
    }

    public boolean deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            return false;
        }

        doctorRepository.deleteById(id);
        return true;
    }
}