package com.slotora.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StaffRequest {
    @NotBlank private String name;
    @NotBlank private String role;
    @NotNull private Long businessId;
}