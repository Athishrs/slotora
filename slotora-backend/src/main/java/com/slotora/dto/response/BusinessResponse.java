package com.slotora.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class BusinessResponse {
    private Long id;
    private String name;
    private String category;
    private String description;
}