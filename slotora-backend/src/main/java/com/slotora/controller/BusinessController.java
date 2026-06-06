package com.slotora.controller;

import com.slotora.dto.request.BusinessRequest;
import com.slotora.service.BusinessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody BusinessRequest req) {
        return ResponseEntity.status(201).body(businessService.createBusiness(req));
}
}