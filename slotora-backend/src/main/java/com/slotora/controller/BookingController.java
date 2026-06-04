package com.slotora.controller;

import com.slotora.dto.request.BookingRequest;
import com.slotora.entity.User;
import com.slotora.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<?> getMyBookings(@AuthenticationPrincipal User user) {
        System.out.println("User ID: " + user.getId());
        return ResponseEntity.ok(bookingService.getBookingsForUser(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@AuthenticationPrincipal User user,
                                           @Valid @RequestBody BookingRequest req) {
        return ResponseEntity.status(201).body(bookingService.createBooking(user.getId(), req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@AuthenticationPrincipal User user,
                                           @PathVariable Long id) {
        bookingService.cancelBooking(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}