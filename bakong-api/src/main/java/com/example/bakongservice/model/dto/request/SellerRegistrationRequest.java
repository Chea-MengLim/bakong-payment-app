package com.example.bakongservice.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerRegistrationRequest {

    @NotBlank(message = "Bakong Account ID is required")
    private String bakongAccountId;

    @NotBlank(message = "Acquiring Bank is required")
    private String acquiringBank;

    @NotBlank(message = "Bank Account ID is required")
    private String bankAccountId;

    @NotBlank(message = "Bank Account Name is required")
    private String bankAccountName;

    @NotBlank(message = "Mobile Number is required")
    private String mobileNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Store Label is required")
    private String storeLabel;
}
