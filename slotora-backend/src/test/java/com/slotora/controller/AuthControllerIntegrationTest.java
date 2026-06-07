package com.slotora.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.slotora.BaseIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // -------------------------------------------------------
    // POST /api/auth/register — happy path
    // -------------------------------------------------------
    @Test
    void register_success_returns201WithToken() throws Exception {
        Map<String, String> request = Map.of(
                "name", "Sarah the Groomer",
                "email", "sarah@slotora.com",
                "password", "password123"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Sarah the Groomer"))
                .andExpect(jsonPath("$.email").value("sarah@slotora.com"));
    }

    // -------------------------------------------------------
    // POST /api/auth/register — duplicate email
    // -------------------------------------------------------
    @Test
    void register_duplicateEmail_returns409() throws Exception {
        Map<String, String> request = Map.of(
                "name", "Sarah the Groomer",
                "email", "duplicate@slotora.com",
                "password", "password123"
        );

        // First registration — should succeed
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Second registration with same email — should fail
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    // -------------------------------------------------------
    // POST /api/auth/register — missing fields
    // -------------------------------------------------------
    @Test
    void register_missingFields_returns400() throws Exception {
        Map<String, String> request = Map.of(
                "email", "sarah@slotora.com"
                // name and password missing
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // -------------------------------------------------------
    // POST /api/auth/login — happy path
    // -------------------------------------------------------
    @Test
    void login_success_returns200WithToken() throws Exception {
        // First register the user
        Map<String, String> registerRequest = Map.of(
                "name", "Max's Owner",
                "email", "maxowner@slotora.com",
                "password", "password123"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Then login with same credentials
        Map<String, String> loginRequest = Map.of(
                "email", "maxowner@slotora.com",
                "password", "password123"
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value("maxowner@slotora.com"));
    }

    // -------------------------------------------------------
    // POST /api/auth/login — wrong password
    // -------------------------------------------------------
    @Test
    void login_wrongPassword_returns401() throws Exception {
        // Register first
        Map<String, String> registerRequest = Map.of(
                "name", "Bella's Owner",
                "email", "bellaowner@slotora.com",
                "password", "password123"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Login with wrong password
        Map<String, String> loginRequest = Map.of(
                "email", "bellaowner@slotora.com",
                "password", "wrongpassword"
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    // -------------------------------------------------------
    // POST /api/auth/login — user does not exist
    // -------------------------------------------------------
    @Test
    void login_userNotFound_returns401() throws Exception {
        Map<String, String> loginRequest = Map.of(
                "email", "ghost@slotora.com",
                "password", "password123"
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}