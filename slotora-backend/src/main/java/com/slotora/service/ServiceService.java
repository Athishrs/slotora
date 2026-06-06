package com.slotora.service;

import com.slotora.dto.request.ServiceRequest;
import com.slotora.dto.response.ServiceResponse;
import com.slotora.entity.Business;
import com.slotora.exception.ResourceNotFoundException;
import com.slotora.repository.BusinessRepository;
import com.slotora.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final BusinessRepository businessRepository;

    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(s -> new ServiceResponse(s.getId(), s.getName(),
                        s.getDurationMins(), s.getPrice(), s.getBusiness().getId()))
                .collect(Collectors.toList());
    }

    public ServiceResponse createService(ServiceRequest req) {
        Business business = businessRepository.findById(req.getBusinessId())
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));

        com.slotora.entity.Service s = new com.slotora.entity.Service();
        s.setName(req.getName());
        s.setDurationMins(req.getDurationMins());
        s.setPrice(req.getPrice());
        s.setBusiness(business);
        serviceRepository.save(s);

        return new ServiceResponse(s.getId(), s.getName(),
                s.getDurationMins(), s.getPrice(), s.getBusiness().getId());
    }
}