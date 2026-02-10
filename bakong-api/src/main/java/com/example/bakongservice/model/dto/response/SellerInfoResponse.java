package com.example.bakongservice.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerInfoResponse {
    private Long id;
    private String bakongAccountId;
    private String acquiringBank;
    private String bankAccountId;
    private String bankAccountName;
    private String mobileNumber;
    private String email;
    private String storeLabel;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
