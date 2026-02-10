package com.example.bakongservice.service;

import com.example.bakongservice.model.dto.request.SellerRegistrationRequest;
import com.example.bakongservice.model.dto.response.SellerInfoResponse;
import com.example.bakongservice.model.dto.response.SellerRegistrationResponse;

import java.util.List;

public interface SellerService {
    SellerRegistrationResponse registerSeller(SellerRegistrationRequest request);
    List<SellerInfoResponse> getAllSellers();
}
