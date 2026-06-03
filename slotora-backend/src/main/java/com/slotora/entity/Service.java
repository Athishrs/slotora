package com.slotora.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;      // FK → businesses.id

    @Column(nullable = false)
    private String name;            // Teeth Cleaning, Full Groom etc.

    @Column(nullable = false)
    private Integer durationMins;   // how long the service takes

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;       // use BigDecimal for money — never Double
}
