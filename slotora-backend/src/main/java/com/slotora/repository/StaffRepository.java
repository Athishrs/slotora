package com.slotora.repository;

import com.slotora.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByBusinessId(Long businessId);
}