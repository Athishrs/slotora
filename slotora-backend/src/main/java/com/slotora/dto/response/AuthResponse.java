package com.slotora.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String token;    // JWT token
    private String name;     // user's name
    private String email;    // user's email
}