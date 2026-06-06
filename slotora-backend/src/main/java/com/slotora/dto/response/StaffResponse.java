package com.slotora.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StaffResponse {
    private Long id;
    private String name;
    private String role;
    private Long businessId;
}