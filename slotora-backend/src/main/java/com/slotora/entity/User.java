package com.slotora.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity                          // tells Hibernate: map this class to a table
@Table(name = "users")           // table name in PostgreSQL
@Getter                          // Lombok generates all getters
@Setter                          // Lombok generates all setters
@NoArgsConstructor               // Lombok generates empty constructor
@AllArgsConstructor              // Lombok generates constructor with all fields
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // auto-increment
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)  // no duplicate emails
    private String email;

    @Column(nullable = false)
    private String passwordHash;             // never store plain text

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;         // auto-set on INSERT

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();
}