package com.example.bakongservice.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sellers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String bakongAccountId;

    @Column(nullable = false)
    private String acquiringBank;

    @Column(nullable = false)
    private String bankAccountId;

    @Column(nullable = false)
    private String bankAccountName;

    @Column(nullable = false)
    private String mobileNumber;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String storeLabel;

    @Column(nullable = false)
    private String password;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
