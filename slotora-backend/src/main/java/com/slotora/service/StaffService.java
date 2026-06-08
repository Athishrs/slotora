package com.slotora.service;

import com.slotora.dto.request.StaffRequest;
import com.slotora.dto.response.StaffResponse;
import com.slotora.entity.Staff;
import com.slotora.exception.ResourceNotFoundException;
import com.slotora.repository.BusinessRepository;
import com.slotora.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final BusinessRepository businessRepository;

    public void deleteStaff(Long staffId) {
        if (!staffRepository.existsById(staffId)) {
            throw new ResourceNotFoundException("Staff not found");
        }
        staffRepository.deleteById(staffId);
    }

    public List<StaffResponse> getStaffByBusiness(Long businessId) {
        return staffRepository.findByBusinessId(businessId).stream()
                .map(s -> new StaffResponse(s.getId(), s.getName(), s.getRole(), s.getBusiness().getId()))
                .collect(Collectors.toList());
    }

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