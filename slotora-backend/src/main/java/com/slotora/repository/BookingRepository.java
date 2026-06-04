package com.slotora.repository;

import com.slotora.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    boolean existsByStaffIdAndAppointmentTime(Long staffId,
                                              java.time.LocalDateTime appointmentTime);
}