package com.slotora.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data @AllArgsConstructor
public class ServiceResponse {
    private Long id;
    private String name;
    private int durationMins;
    private BigDecimal price;
    private Long businessId;
}