package com.example.bakongservice.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckTransactionResponse {

    private Integer responseCode;
    private String responseMessage;
    private Integer errorCode;
    private TransactionData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionData {
        private String hash;
        private String fromAccountId;
        private String toAccountId;
        private String currency;
        private BigDecimal amount;
        private String description;
        private Double createdDateMs;
        private Double acknowledgedDateMs;
    }
}

