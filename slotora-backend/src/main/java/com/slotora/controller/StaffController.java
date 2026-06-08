package com.slotora.controller;

import com.slotora.dto.request.StaffRequest;
import com.slotora.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    public ResponseEntity<?> getByBusiness(@RequestParam Long businessId) {
        return ResponseEntity.ok(staffService.getStaffByBusiness(businessId));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody StaffRequest req) {
        return ResponseEntity.status(201).body(staffService.createStaff(req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }
}