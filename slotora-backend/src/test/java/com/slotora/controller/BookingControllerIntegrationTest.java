package com.slotora.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.slotora.BaseIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class BookingControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // Shared token — one user registered and logged in before all tests
    private String token;

    // -------------------------------------------------------
    // Register + login before each test to get a fresh token
    // -------------------------------------------------------
    @BeforeEach
    void setUp() throws Exception {
        // Register a dog owner
        Map<String, String> registerRequest = Map.of(
                "name", "Max's Owner",
                "email", "maxowner_" + System.currentTimeMillis() + "@slotora.com",
                "password", "password123"
        );

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        // Extract token from response
        String responseBody = result.getResponse().getContentAsString();
        token = objectMapper.readTree(responseBody).get("token").asText();
    }

    // -------------------------------------------------------
    // GET /api/bookings — authenticated, empty list
    // -------------------------------------------------------
    @Test
    void getMyBookings_authenticated_returnsEmptyList() throws Exception {
        mockMvc.perform(get("/api/bookings")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    // -------------------------------------------------------
    // GET /api/bookings — no token, should be rejected
    // -------------------------------------------------------
    @Test
    void getMyBookings_noToken_returns403() throws Exception {
        mockMvc.perform(get("/api/bookings"))
                .andExpect(status().isForbidden());
    }

    // -------------------------------------------------------
    // POST /api/bookings — happy path
    // -------------------------------------------------------
    @Test
    void createBooking_success_returns201() throws Exception {
        Map<String, Object> request = Map.of(
                "serviceId", 1,
                "staffId", 1,
                "appointmentTime", "2025-08-15T10:00:00",
                "notes", "Golden Retriever, nervous around loud dryers"
        );

        mockMvc.perform(post("/api/bookings")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.serviceName").value("Haircut"))
                .andExpect(jsonPath("$.staffName").value("Sarah"))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.notes").value("Golden Retriever, nervous around loud dryers"));
    }

    // -------------------------------------------------------
    // POST /api/bookings — slot already taken
    // -------------------------------------------------------
    @Test
    void createBooking_slotTaken_returns409() throws Exception {
        Map<String, Object> request = Map.of(
                "serviceId", 1,
                "staffId", 1,
                "appointmentTime", "2025-08-15T11:00:00",
                "notes", "Poodle trim"
        );

        // First booking — should succeed
        mockMvc.perform(post("/api/bookings")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Same slot again — should fail
        mockMvc.perform(post("/api/bookings")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    // -------------------------------------------------------
    // DELETE /api/bookings/{id} — happy path
    // -------------------------------------------------------
    @Test
    void cancelBooking_success_returns204() throws Exception {
        // First create a booking
        Map<String, Object> request = Map.of(
                "serviceId", 1,
                "staffId", 1,
                "appointmentTime", "2025-08-15T12:00:00",
                "notes", "Labrador bath"
        );

        MvcResult createResult = mockMvc.perform(post("/api/bookings")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        // Extract the booking id from the response
        String responseBody = createResult.getResponse().getContentAsString();
        Long bookingId = objectMapper.readTree(responseBody).get("id").asLong();

        // Now cancel it
        mockMvc.perform(delete("/api/bookings/" + bookingId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }

    // -------------------------------------------------------
    // DELETE /api/bookings/{id} — booking does not exist
    // -------------------------------------------------------
    @Test
    void cancelBooking_notFound_returns404() throws Exception {
        mockMvc.perform(delete("/api/bookings/99999")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }
}