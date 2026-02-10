package com.example.bakongservice.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private BigDecimal priceAfterDiscount;
    @JsonProperty("imageUrl")
    private String imageUrl;
    private StoreInfo store;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /** Full seller/store info for QR code generation (all fields except password). */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StoreInfo {
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
}
