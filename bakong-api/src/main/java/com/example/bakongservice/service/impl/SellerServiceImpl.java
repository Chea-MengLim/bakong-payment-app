package com.example.bakongservice.service.impl;

import com.example.bakongservice.model.dto.request.SellerRegistrationRequest;
import com.example.bakongservice.model.dto.response.SellerInfoResponse;
import com.example.bakongservice.model.dto.response.SellerRegistrationResponse;
import com.example.bakongservice.model.entity.Seller;
import com.example.bakongservice.repository.SellerRepository;
import com.example.bakongservice.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String ALL_CHARS = UPPER + LOWER + DIGITS;
    private static final Random RANDOM = new SecureRandom();

    @Override
    @Transactional
    public SellerRegistrationResponse registerSeller(SellerRegistrationRequest request) {
        // Check if email already exists
        if (sellerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }

        // Check if bakongAccountId already exists
        if (sellerRepository.existsByBakongAccountId(request.getBakongAccountId())) {
            throw new IllegalArgumentException("Bakong Account ID already exists: " + request.getBakongAccountId());
        }

        // Generate 8-character password
        String generatedPassword = generatePassword(8);

        // Create seller entity
        Seller seller = Seller.builder()
                .bakongAccountId(request.getBakongAccountId())
                .acquiringBank(request.getAcquiringBank())
                .bankAccountId(request.getBankAccountId())
                .bankAccountName(request.getBankAccountName())
                .mobileNumber(request.getMobileNumber())
                .email(request.getEmail())
                .storeLabel(request.getStoreLabel())
                .password(passwordEncoder.encode(generatedPassword))
                .build();

        // Save seller
        Seller savedSeller = sellerRepository.save(seller);

        // Return response with plain password (only time it's visible)
        return SellerRegistrationResponse.builder()
                .id(savedSeller.getId())
                .email(savedSeller.getEmail())
                .generatedPassword(generatedPassword)
                .storeLabel(savedSeller.getStoreLabel())
                .createdAt(savedSeller.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SellerInfoResponse> getAllSellers() {
        return sellerRepository.findAll().stream()
                .map(this::toSellerInfoResponse)
                .collect(Collectors.toList());
    }

    private SellerInfoResponse toSellerInfoResponse(Seller seller) {
        return SellerInfoResponse.builder()
                .id(seller.getId())
                .bakongAccountId(seller.getBakongAccountId())
                .acquiringBank(seller.getAcquiringBank())
                .bankAccountId(seller.getBankAccountId())
                .bankAccountName(seller.getBankAccountName())
                .mobileNumber(seller.getMobileNumber())
                .email(seller.getEmail())
                .storeLabel(seller.getStoreLabel())
                .createdAt(seller.getCreatedAt())
                .updatedAt(seller.getUpdatedAt())
                .build();
    }

    private String generatePassword(int length) {
        StringBuilder password = new StringBuilder(length);
        
        // Ensure at least one character from each category
        password.append(UPPER.charAt(RANDOM.nextInt(UPPER.length())));
        password.append(LOWER.charAt(RANDOM.nextInt(LOWER.length())));
        password.append(DIGITS.charAt(RANDOM.nextInt(DIGITS.length())));
        
        // Fill the rest randomly
        for (int i = password.length(); i < length; i++) {
            password.append(ALL_CHARS.charAt(RANDOM.nextInt(ALL_CHARS.length())));
        }
        
        // Shuffle the password
        char[] passwordArray = password.toString().toCharArray();
        for (int i = passwordArray.length - 1; i > 0; i--) {
            int j = RANDOM.nextInt(i + 1);
            char temp = passwordArray[i];
            passwordArray[i] = passwordArray[j];
            passwordArray[j] = temp;
        }
        
        return new String(passwordArray);
    }
}
