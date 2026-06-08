package com.slotora.service;

import com.slotora.dto.request.BusinessRequest;
import com.slotora.dto.response.BusinessDetailResponse;
import com.slotora.dto.response.BusinessResponse;
import com.slotora.dto.response.ServiceResponse;
import com.slotora.dto.response.StaffResponse;
import com.slotora.entity.Business;
import com.slotora.entity.User;
import com.slotora.exception.ResourceNotFoundException;
import com.slotora.repository.BusinessRepository;
import com.slotora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessService {

    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;

    public List<BusinessResponse> getAllBusinesses() {
        return businessRepository.findAll().stream()
                .map(b -> new BusinessResponse(b.getId(), b.getName(),
                        b.getCategory(), b.getDescription()))
                .collect(Collectors.toList());
    }

    public BusinessResponse createBusiness(BusinessRequest req, Long userId) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Business b = new Business();
        b.setName(req.getName());
        b.setCategory(req.getCategory());
        b.setDescription(req.getDescription());
        b.setOwner(owner);
        businessRepository.save(b);
        return new BusinessResponse(b.getId(), b.getName(), b.getCategory(), b.getDescription());
    }

    public BusinessDetailResponse getMyBusiness(Long userId) {
        Business b = businessRepository.findByOwnerIdWithDetails(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No business found for this user"));

        List<ServiceResponse> services = b.getServices().stream()
                .map(s -> new ServiceResponse(s.getId(), s.getName(), s.getDurationMins(), s.getPrice(), b.getId()))
                .collect(Collectors.toList());

        List<StaffResponse> staff = b.getStaff().stream()
                .map(s -> new StaffResponse(s.getId(), s.getName(), s.getRole(), b.getId()))
                .collect(Collectors.toList());

        return new BusinessDetailResponse(b.getId(), b.getName(), b.getCategory(), b.getDescription(), services, staff);
    }
}
