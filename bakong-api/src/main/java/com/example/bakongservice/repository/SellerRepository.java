package com.example.bakongservice.repository;

import com.example.bakongservice.model.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {
    Optional<Seller> findByEmail(String email);
    Optional<Seller> findByBakongAccountId(String bakongAccountId);
    boolean existsByEmail(String email);
    boolean existsByBakongAccountId(String bakongAccountId);
}
