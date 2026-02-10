package com.example.bakongservice.service.impl;

import com.example.bakongservice.model.dto.request.*;
import com.example.bakongservice.model.dto.response.CheckTransactionResponse;
import com.example.bakongservice.service.BakongKHQRService;
import kh.gov.nbc.bakong_khqr.BakongKHQR;
import kh.gov.nbc.bakong_khqr.model.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class BakongKHQRServiceImpl implements BakongKHQRService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${bakong.base-url}")
    private String bakongBaseUrl;

    @Value("${bakong.token}")
    private String bakongToken;

    @Override
    public KHQRData generateIndividual(IndividualInfoRequest r) {
        IndividualInfo info = new IndividualInfo();

        info.setBakongAccountId(r.getBakongAccountId());
        info.setAccountInformation(r.getAccountInformation());
        info.setAcquiringBank(r.getAcquiringBank());
        info.setCurrency(KHQRCurrency.valueOf(r.getCurrency()));
        info.setAmount(r.getAmount());
        info.setMerchantName(r.getMerchantName());
        info.setMerchantCity(r.getMerchantCity());
        info.setBillNumber(r.getBillNumber());
        info.setMobileNumber(r.getMobileNumber());
        info.setStoreLabel(r.getStoreLabel());
        info.setTerminalLabel(r.getTerminalLabel());
        info.setUpiAccountInformation(r.getUpiAccountInformation());
        info.setPurposeOfTransaction(r.getPurposeOfTransaction());
        info.setMerchantAlternateLanguagePreference(r.getMerchantAlternateLanguagePreference());
        info.setMerchantNameAlternateLanguage(r.getMerchantNameAlternateLanguage());
        info.setMerchantCityAlternateLanguage(r.getMerchantCityAlternateLanguage());

        if (r.getExpirationTimestamp() != null) {
            info.setExpirationTimestamp(r.getExpirationTimestamp());
        }

        return execute(BakongKHQR.generateIndividual(info));
    }

    @Override
    public KHQRData generateMerchant(MerchantInfoRequest r) {
        MerchantInfo info = new MerchantInfo();

        info.setBakongAccountId(r.getBakongAccountId());
        info.setMerchantId(r.getMerchantId());
        info.setAcquiringBank(r.getAcquiringBank());
        info.setCurrency(KHQRCurrency.valueOf(r.getCurrency()));
        info.setAmount(r.getAmount());
        info.setMerchantName(r.getMerchantName());
        info.setMerchantCity(r.getMerchantCity());

        if (r.getExpirationTimestamp() != null) {
            info.setExpirationTimestamp(r.getExpirationTimestamp());
        }

        return execute(BakongKHQR.generateMerchant(info));
    }

    @Override
    public boolean verify(String qrCode) {
        return execute(BakongKHQR.verify(qrCode)).isValid();
    }

    @Override
    public KHQRDecodeData decode(String qrCode) {
        return execute(BakongKHQR.decode(qrCode));
    }

    @Override
    public String generateDeepLink(DeepLinkRequest r) {
        SourceInfo source = new SourceInfo();
        source.setAppName(r.getAppName());
        source.setAppIconUrl(r.getAppIconUrl());
        source.setAppDeepLinkCallback(r.getAppDeepLinkCallback());

        return execute(BakongKHQR.generateDeepLink(r.getUrl(), r.getQr(), source))
                .getShortLink();
    }

    @Override
    public CheckTransactionResponse checkTransactionByMd5(String md5) {
        String url = bakongBaseUrl + "/check_transaction_by_md5";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(bakongToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = Map.of("md5", md5);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<CheckTransactionResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                CheckTransactionResponse.class
        );

        return response.getBody();
    }

    /* ---------- Common success check ---------- */

    private <T> T execute(KHQRResponse<T> response) {
        if (response.getKHQRStatus().getCode() != 0) {
            throw new RuntimeException(response.getKHQRStatus().getMessage());
        }
        return response.getData();
    }
}
