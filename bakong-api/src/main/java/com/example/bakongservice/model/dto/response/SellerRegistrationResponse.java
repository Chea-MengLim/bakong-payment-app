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
public class SellerRegistrationResponse {
    private Long id;
    private String email;
    private String generatedPassword;
    private String storeLabel;
    private LocalDateTime createdAt;
}
