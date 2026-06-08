package com.slotora.controller;

import com.slotora.dto.request.ServiceRequest;
import com.slotora.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ServiceRequest req) {
        return ResponseEntity.status(201).body(serviceService.createService(req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}