package com.slotora.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class ServiceResponse {
    private Long id;
    private String name;
    private int durationMins;
    private double price;
    private Long businessId;
}