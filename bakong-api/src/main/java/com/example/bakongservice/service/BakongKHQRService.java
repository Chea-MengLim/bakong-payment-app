package com.example.bakongservice.service;

import com.example.bakongservice.model.dto.request.*;
import com.example.bakongservice.model.dto.response.CheckBakongAccountResponse;
import com.example.bakongservice.model.dto.response.CheckTransactionResponse;

import kh.gov.nbc.bakong_khqr.model.KHQRData;
import kh.gov.nbc.bakong_khqr.model.KHQRDecodeData;

public interface BakongKHQRService {

    KHQRData generateIndividual(IndividualInfoRequest request);

    KHQRData generateMerchant(MerchantInfoRequest request);

    boolean verify(String qrCode);

    KHQRDecodeData decode(String qrCode);

    String generateDeepLink(DeepLinkRequest request);

    CheckTransactionResponse checkTransactionByMd5(String md5);

    /**
     * Check if a Bakong account exists by calling Bakong check_bakong_account API.
     * @param accountId Bakong Account ID (e.g. user@bank)
     * @return true if account exists (responseCode 0), false if not found (responseCode 1)
     */
    boolean checkBakongAccountExists(String accountId);

    /**
     * Call Bakong check_bakong_account API and return full response.
     */
    CheckBakongAccountResponse checkBakongAccount(String accountId);
}
