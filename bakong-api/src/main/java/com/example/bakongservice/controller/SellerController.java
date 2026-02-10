package com.example.bakongservice.controller;

import com.example.bakongservice.model.dto.ApiResponse;
import com.example.bakongservice.model.dto.request.SellerRegistrationRequest;
import com.example.bakongservice.model.dto.response.SellerInfoResponse;
import com.example.bakongservice.model.dto.response.SellerRegistrationResponse;
import com.example.bakongservice.service.SellerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/sellers")
public class SellerController {

    private final SellerService sellerService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<SellerRegistrationResponse>> registerSeller(
            @Valid @RequestBody SellerRegistrationRequest request) {
        SellerRegistrationResponse response = sellerService.registerSeller(request);
        ApiResponse<SellerRegistrationResponse> apiResponse = ApiResponse.<SellerRegistrationResponse>builder()
                .status(HttpStatus.CREATED)
                .message("Seller registered successfully")
                .payload(response)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SellerInfoResponse>>> getAllSellers() {
        List<SellerInfoResponse> sellers = sellerService.getAllSellers();
        ApiResponse<List<SellerInfoResponse>> apiResponse = ApiResponse.<List<SellerInfoResponse>>builder()
                .status(HttpStatus.OK)
                .message("Sellers retrieved successfully")
                .payload(sellers)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
