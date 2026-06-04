package com.slotora.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequest {
    @NotNull private Long serviceId;
    @NotNull private Long staffId;
    @NotNull private LocalDateTime appointmentTime;
    private String notes;
}