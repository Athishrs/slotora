package com.slotora.service;

import com.slotora.dto.request.BookingRequest;
import com.slotora.dto.response.BookingResponse;
import com.slotora.entity.*;
import com.slotora.exception.ResourceNotFoundException;
import com.slotora.exception.SlotUnavailableException;
import com.slotora.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock private BookingRepository bookingRepository;
    @Mock private ServiceRepository serviceRepository;
    @Mock private StaffRepository staffRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private BookingService bookingService;

    private User testUser;
    private com.slotora.entity.Service testService;
    private Staff testStaff;
    private BookingRequest bookingRequest;
    private LocalDateTime appointmentTime;

    @BeforeEach
    void setUp() {
        appointmentTime = LocalDateTime.of(2025, 8, 15, 10, 0);

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("owner@test.com");

        testService = new com.slotora.entity.Service();
        testService.setId(1L);
        testService.setName("Full Groom");

        testStaff = new Staff();
        testStaff.setId(1L);
        testStaff.setName("Sarah");

        bookingRequest = new BookingRequest();
        bookingRequest.setServiceId(1L);
        bookingRequest.setStaffId(1L);
        bookingRequest.setAppointmentTime(appointmentTime);
        bookingRequest.setNotes("Golden Retriever, nervous around loud dryers");
    }

    @Test
    void createBooking_success_returnsBookingResponse() {
        when(bookingRepository.existsByStaffIdAndAppointmentTime(1L, appointmentTime))
                .thenReturn(false);
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(testService));
        when(staffRepository.findById(1L)).thenReturn(Optional.of(testStaff));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        Booking savedBooking = new Booking();
        savedBooking.setId(99L);
        savedBooking.setUser(testUser);
        savedBooking.setService(testService);
        savedBooking.setStaff(testStaff);
        savedBooking.setAppointmentTime(appointmentTime);
        savedBooking.setStatus(BookingStatus.PENDING);
        savedBooking.setNotes("Golden Retriever, nervous around loud dryers");

        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

        BookingResponse response = bookingService.createBooking(1L, bookingRequest);

        assertThat(response.getId()).isEqualTo(99L);
        assertThat(response.getServiceName()).isEqualTo("Full Groom");
        assertThat(response.getStaffName()).isEqualTo("Sarah");
        assertThat(response.getStatus()).isEqualTo(BookingStatus.PENDING);
        assertThat(response.getNotes()).isEqualTo("Golden Retriever, nervous around loud dryers");
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void createBooking_slotTaken_throwsSlotUnavailableException() {
        when(bookingRepository.existsByStaffIdAndAppointmentTime(1L, appointmentTime))
                .thenReturn(true);

        assertThatThrownBy(() -> bookingService.createBooking(1L, bookingRequest))
                .isInstanceOf(SlotUnavailableException.class)
                .hasMessageContaining("already booked");

        verify(serviceRepository, never()).findById(any());
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void createBooking_serviceNotFound_throwsResourceNotFoundException() {
        when(bookingRepository.existsByStaffIdAndAppointmentTime(1L, appointmentTime))
                .thenReturn(false);
        when(serviceRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.createBooking(1L, bookingRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Service not found");
    }

    @Test
    void cancelBooking_success_setsStatusCancelled() {
        Booking booking = new Booking();
        booking.setId(10L);
        booking.setUser(testUser);
        booking.setStatus(BookingStatus.PENDING);

        when(bookingRepository.findById(10L)).thenReturn(Optional.of(booking));

        bookingService.cancelBooking(10L, 1L);

        assertThat(booking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        verify(bookingRepository, times(1)).save(booking);
    }

    @Test
    void cancelBooking_bookingNotFound_throwsResourceNotFoundException() {
        when(bookingRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.cancelBooking(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Booking not found");
    }

    @Test
    void cancelBooking_wrongUser_throwsRuntimeException() {
        Booking booking = new Booking();
        booking.setId(10L);
        booking.setUser(testUser);
        booking.setStatus(BookingStatus.PENDING);

        when(bookingRepository.findById(10L)).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> bookingService.cancelBooking(10L, 2L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Unauthorized");

        assertThat(booking.getStatus()).isEqualTo(BookingStatus.PENDING);
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void getBookingsForUser_returnsMappedList() {
        Booking booking = new Booking();
        booking.setId(5L);
        booking.setUser(testUser);
        booking.setService(testService);
        booking.setStaff(testStaff);
        booking.setAppointmentTime(appointmentTime);
        booking.setStatus(BookingStatus.PENDING);
        booking.setNotes(null);

        when(bookingRepository.findByUserId(1L)).thenReturn(List.of(booking));

        List<BookingResponse> result = bookingService.getBookingsForUser(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getServiceName()).isEqualTo("Full Groom");
        assertThat(result.get(0).getStaffName()).isEqualTo("Sarah");
        assertThat(result.get(0).getStatus()).isEqualTo(BookingStatus.PENDING);
    }
}