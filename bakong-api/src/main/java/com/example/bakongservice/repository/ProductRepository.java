package com.example.bakongservice.repository;

import com.example.bakongservice.model.entity.Product;
import com.example.bakongservice.model.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStore(Seller seller);
    List<Product> findByStoreId(Long sellerId);
}
