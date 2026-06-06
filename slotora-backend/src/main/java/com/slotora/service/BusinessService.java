package com.slotora.service;

import com.slotora.dto.request.BusinessRequest;
import com.slotora.dto.response.BusinessResponse;
import com.slotora.entity.Business;
import com.slotora.repository.BusinessRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessService {

    private final BusinessRepository businessRepository;

    public List<BusinessResponse> getAllBusinesses() {
        return businessRepository.findAll().stream()
                .map(b -> new BusinessResponse(b.getId(), b.getName(),
                        b.getCategory(), b.getDescription()))
                .collect(Collectors.toList());
    }

    public BusinessResponse createBusiness(BusinessRequest req) {
        Business b = new Business();
        b.setName(req.getName());
        b.setCategory(req.getCategory());
        b.setDescription(req.getDescription());
        businessRepository.save(b);
        return new BusinessResponse(b.getId(), b.getName(), b.getCategory(), b.getDescription());
    }
}