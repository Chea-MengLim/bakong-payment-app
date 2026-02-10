package com.example.bakongservice.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckTransactionRequest {

    @NotBlank(message = "md5 is required")
    private String md5;
}

