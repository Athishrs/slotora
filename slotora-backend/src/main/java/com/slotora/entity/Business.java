package com.slotora.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="businesses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String name;

    @Column
    private String category;

    @Column(columnDefinition ="TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    private List<Service> services=new ArrayList<>();

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    private List<Staff> staff=new ArrayList<>();

}
