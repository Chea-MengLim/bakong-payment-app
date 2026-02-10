package com.example.bakongservice.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IndividualInfoRequest {
    @Schema(
            description = "Bakong Account ID",
            example = "menglim_chea@bkrt"
    )
    private String bakongAccountId;

    @Schema(
            description = "Account or wallet information",
            example = "500440639"
    )
    private String accountInformation;

    @Schema(
            description = "Acquiring bank name",
            example = "ABA Bank"
    )
    private String acquiringBank;

    @Schema(
            description = "Transaction currency code",
            example = "KHR",
            allowableValues = {"KHR", "USD"}
    )
    private String currency;

    @Schema(
            description = "Payment amount",
            example = "100"
    )
    private Double amount;

    @Schema(
            description = "Merchant name",
            example = "Chea Menglim"
    )
    private String merchantName;

    @Schema(
            description = "Merchant city",
            example = "Phnom Penh"
    )
    private String merchantCity;

    @Schema(
            description = "Bill or invoice number",
            example = "#123456"
    )
    private String billNumber;

    @Schema(
            description = "Merchant mobile number",
            example = "855719491463"
    )
    private String mobileNumber;

    @Schema(
            description = "Store label or shop name",
            example = "Menglim Shop"
    )
    private String storeLabel;

    @Schema(
            description = "Terminal or cashier label",
            example = "Cashier_1"
    )
    private String terminalLabel;

    @Schema(
            description = "UPI or account information",
            example = "500440639"
    )
    private String upiAccountInformation;

    @Schema(
            description = "Purpose of the transaction",
            example = "Buy Coffee"
    )
    private String purposeOfTransaction;

    @Schema(
            description = "Language preference for alternate fields",
            example = "km"
    )
    private String merchantAlternateLanguagePreference;

    @Schema(
            description = "Merchant name in alternate language",
            example = "ជា ម៉េងលីម"
    )
    private String merchantNameAlternateLanguage;

    @Schema(
            description = "Merchant city in alternate language",
            example = "ភ្នំពេញ"
    )
    private String merchantCityAlternateLanguage;

    @Schema(
            description = "QR expiration timestamp in milliseconds",
            example = "9741094900000"
    )
    private Long expirationTimestamp;
}
