package com.slotora.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceRequest {
    @NotBlank private String name;
    @NotNull private Integer durationMins;
    @NotNull private BigDecimal price;
    @NotNull private Long businessId;
}