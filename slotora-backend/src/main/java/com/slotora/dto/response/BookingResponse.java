package com.slotora.dto.response;

import com.slotora.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data @AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String serviceName;
    private String staffName;
    private LocalDateTime appointmentTime;
    private BookingStatus status;
    private String notes;
}