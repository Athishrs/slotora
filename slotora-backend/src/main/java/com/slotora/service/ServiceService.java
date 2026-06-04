package com.slotora.service;

import com.slotora.dto.response.ServiceResponse;
import com.slotora.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(s -> new ServiceResponse(s.getId(), s.getName(),
                        s.getDurationMins(), s.getPrice(), s.getBusiness().getId()))
                .collect(Collectors.toList());
    }
}