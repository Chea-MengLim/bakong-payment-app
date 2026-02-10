package com.example.bakongservice.model.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Price after discount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price after discount must be greater than 0")
    private BigDecimal priceAfterDiscount;

    /** HTTP or HTTPS URL of the product image. Optional. */
    @JsonProperty("imageUrl")
    @Pattern(regexp = "^(https?://.*)?$", message = "Image URL must be a valid HTTP or HTTPS URL")
    private String imageUrl;
}
