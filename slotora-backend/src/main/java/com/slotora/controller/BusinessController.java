package com.slotora.controller;

import com.slotora.dto.request.BusinessRequest;
import com.slotora.entity.User;
import com.slotora.exception.ResourceNotFoundException;
import com.slotora.service.BusinessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/businesses")
@RequiredArgsConstructor
public class BusinessController {

    private final BusinessService businessService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(businessService.getAllBusinesses());
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMy(@AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(businessService.getMyBusiness(user.getId()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal User user,
                                    @Valid @RequestBody BusinessRequest req) {
        return ResponseEntity.status(201).body(businessService.createBusiness(req, user.getId()));
    }
}
