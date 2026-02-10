package com.example.bakongservice.service;

import com.example.bakongservice.model.dto.request.ProductRequest;
import com.example.bakongservice.model.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(Long sellerId, ProductRequest request);
    List<ProductResponse> getProductsBySeller(Long sellerId);
    ProductResponse getProductById(Long productId);
    List<ProductResponse> getAllProducts();
}
