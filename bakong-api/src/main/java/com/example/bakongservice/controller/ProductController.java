package com.example.bakongservice.controller;

import com.example.bakongservice.model.dto.ApiResponse;
import com.example.bakongservice.model.dto.request.ProductRequest;
import com.example.bakongservice.model.dto.response.ProductResponse;
import com.example.bakongservice.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    @PostMapping("/seller/{sellerId}")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @PathVariable Long sellerId,
            @Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(sellerId, request);
        ApiResponse<ProductResponse> apiResponse = ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.CREATED)
                .message("Product created successfully")
                .payload(response)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsBySeller(
            @PathVariable Long sellerId) {
        List<ProductResponse> products = productService.getProductsBySeller(sellerId);
        ApiResponse<List<ProductResponse>> apiResponse = ApiResponse.<List<ProductResponse>>builder()
                .status(HttpStatus.OK)
                .message("Products retrieved successfully")
                .payload(products)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(
            @PathVariable Long productId) {
        ProductResponse product = productService.getProductById(productId);
        ApiResponse<ProductResponse> apiResponse = ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.OK)
                .message("Product retrieved successfully")
                .payload(product)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        ApiResponse<List<ProductResponse>> apiResponse = ApiResponse.<List<ProductResponse>>builder()
                .status(HttpStatus.OK)
                .message("All products retrieved successfully")
                .payload(products)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
