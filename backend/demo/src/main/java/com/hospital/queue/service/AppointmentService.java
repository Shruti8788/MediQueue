
package com.hospital.queue.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.queue.entity.Appointment;
import com.hospital.queue.repository.AppointmentRepository;
import com.hospital.queue.repository.PatientRepository;
import com.hospital.queue.repository.DoctorRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    private final PatientRepository patientRepository;

    private final DoctorRepository doctorRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {

        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public Appointment bookAppointment(Appointment appointment) {

        if (!patientRepository.existsById(appointment.getPatientId())) {
            throw new IllegalArgumentException("Patient not found");
        }

        if (!doctorRepository.existsById(appointment.getDoctorId())) {
            throw new IllegalArgumentException("Doctor not found");
        }

        if (appointment.getAppointmentDate() == null ||
                appointment.getAppointmentDate().isBefore(
                        java.time.LocalDate.now())) {

            throw new IllegalArgumentException(
                    "Appointment date must be today or in the future");
        }

        // Check whether the doctor is already booked
        boolean alreadyBooked =
                appointmentRepository
                        .existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatus(
                                appointment.getDoctorId(),
                                appointment.getAppointmentDate(),
                                appointment.getAppointmentTime(),
                                "BOOKED"
                        );

        if (alreadyBooked) {
            throw new IllegalArgumentException(
                    "Doctor already has an appointment at this time.");
        }

        appointment.setStatus("BOOKED");

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    public boolean cancelAppointment(Long id) {

        Appointment appointment =
                appointmentRepository.findById(id).orElse(null);

        if (appointment == null) {
            return false;
        }

        appointment.setStatus("CANCELLED");

        appointmentRepository.save(appointment);

        return true;
    }

}