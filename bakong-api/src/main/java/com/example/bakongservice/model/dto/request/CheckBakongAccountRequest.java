package com.example.bakongservice.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckBakongAccountRequest {

    @NotBlank(message = "Bakong Account ID is required")
    private String accountId;
}
