package com.slotora.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BusinessDetailResponse {
    private Long id;
    private String name;
    private String category;
    private String description;
    private List<ServiceResponse> services;
    private List<StaffResponse> staff;
}
