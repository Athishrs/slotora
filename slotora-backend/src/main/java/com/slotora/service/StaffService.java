package com.slotora.service;

import com.slotora.dto.request.StaffRequest;
import com.slotora.dto.response.StaffResponse;
import com.slotora.entity.Staff;
import com.slotora.exception.ResourceNotFoundException;
import com.slotora.repository.BusinessRepository;
import com.slotora.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final BusinessRepository businessRepository;

    public StaffResponse createStaff(StaffRequest req) {
        var business = businessRepository.findById(req.getBusinessId())
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));

        Staff staff = new Staff();
        staff.setName(req.getName());
        staff.setRole(req.getRole());
        staff.setBusiness(business);

        Staff saved = staffRepository.save(staff);

        return new StaffResponse(saved.getId(), saved.getName(),
                saved.getRole(), saved.getBusiness().getId());
    }
}