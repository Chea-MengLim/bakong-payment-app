package com.example.bakongservice.service.impl;

import com.example.bakongservice.model.dto.request.ProductRequest;
import com.example.bakongservice.model.dto.response.ProductResponse;
import com.example.bakongservice.model.entity.Product;
import com.example.bakongservice.model.entity.Seller;
import com.example.bakongservice.repository.ProductRepository;
import com.example.bakongservice.repository.SellerRepository;
import com.example.bakongservice.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;

    @Override
    @Transactional
    public ProductResponse createProduct(Long sellerId, ProductRequest request) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found with id: " + sellerId));

        Product product = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .priceAfterDiscount(request.getPriceAfterDiscount())
                .imageUrl(request.getImageUrl())
                .store(seller)
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsBySeller(Long sellerId) {
        List<Product> products = productRepository.findByStoreId(sellerId);
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));
        return mapToResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse mapToResponse(Product product) {
        Seller s = product.getStore();
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .priceAfterDiscount(product.getPriceAfterDiscount())
                .imageUrl(product.getImageUrl())
                .store(ProductResponse.StoreInfo.builder()
                        .id(s.getId())
                        .bakongAccountId(s.getBakongAccountId())
                        .acquiringBank(s.getAcquiringBank())
                        .bankAccountId(s.getBankAccountId())
                        .bankAccountName(s.getBankAccountName())
                        .mobileNumber(s.getMobileNumber())
                        .email(s.getEmail())
                        .storeLabel(s.getStoreLabel())
                        .createdAt(s.getCreatedAt())
                        .updatedAt(s.getUpdatedAt())
                        .build())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
