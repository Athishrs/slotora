package com.slotora.repository;

import com.slotora.entity.Business;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BusinessRepository extends JpaRepository<Business, Long> {
    Optional<Business> findByOwnerId(Long ownerId);

    @Query("SELECT DISTINCT b FROM Business b LEFT JOIN FETCH b.services LEFT JOIN FETCH b.staff WHERE b.owner.id = :ownerId")
    Optional<Business> findByOwnerIdWithDetails(@Param("ownerId") Long ownerId);
}