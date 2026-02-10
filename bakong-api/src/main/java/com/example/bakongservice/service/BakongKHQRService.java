package com.example.bakongservice.service;

import com.example.bakongservice.model.dto.request.*;
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
}
