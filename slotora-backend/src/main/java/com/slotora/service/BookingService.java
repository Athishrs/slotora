package com.slotora.service;

import com.slotora.dto.request.BookingRequest;
import com.slotora.dto.response.BookingResponse;
import com.slotora.entity.Booking;
import com.slotora.entity.BookingStatus;
import com.slotora.exception.ResourceNotFoundException;
import com.slotora.exception.SlotUnavailableException;
import com.slotora.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;

    public List<BookingResponse> getBookingsForUser(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse createBooking(Long userId, BookingRequest req) {
        if (req.getStaffId() != null && bookingRepository.existsByStaffIdAndAppointmentTime(
                req.getStaffId(), req.getAppointmentTime())) {
            throw new SlotUnavailableException("This slot is already booked.");
        }

        var service = serviceRepository.findById(req.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        var staff = req.getStaffId() != null
                ? staffRepository.findById(req.getStaffId())
                        .orElseThrow(() -> new ResourceNotFoundException("Staff not found"))
                : null;
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setService(service);
        booking.setStaff(staff);
        booking.setAppointmentTime(req.getAppointmentTime());
        booking.setStatus(BookingStatus.PENDING);
        booking.setNotes(req.getNotes());

        return toResponse(bookingRepository.save(booking));
    }

    public void cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private BookingResponse toResponse(Booking b) {
        String staffName = b.getStaff() != null ? b.getStaff().getName() : null;
        return new BookingResponse(
                b.getId(),
                b.getService().getName(),
                staffName,
                b.getAppointmentTime(),
                b.getStatus(),
                b.getNotes()
        );
    }
}