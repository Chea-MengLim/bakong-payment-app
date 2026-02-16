package com.example.bakongservice.controller;

import com.example.bakongservice.model.dto.request.*;
import com.example.bakongservice.model.dto.response.CheckBakongAccountResponse;
import com.example.bakongservice.model.dto.response.CheckTransactionResponse;
import com.example.bakongservice.service.BakongKHQRService;
import kh.gov.nbc.bakong_khqr.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/khqr")
public class BakongKHQRController {

    private final BakongKHQRService khqrService;

    @PostMapping("/generate/individual")
    public ResponseEntity<?> generateIndividual(@RequestBody IndividualInfoRequest request) {
        KHQRData data = khqrService.generateIndividual(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "qr", data.getQr(),
                "md5", data.getMd5()
        ));
    }

    @PostMapping("/generate/merchant")
    public ResponseEntity<?> generateMerchant(@RequestBody MerchantInfoRequest request) {
        KHQRData data = khqrService.generateMerchant(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "qr", data.getQr(),
                "md5", data.getMd5()
        ));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyQrRequest request) {
        boolean valid = khqrService.verify(request.getQrCode());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "valid", valid
        ));
    }

    @PostMapping("/decode")
    public ResponseEntity<?> decode(@RequestBody VerifyQrRequest request) {
        KHQRDecodeData data = khqrService.decode(request.getQrCode());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", data
        ));
    }

    @PostMapping("/generate/deeplink")
    public ResponseEntity<?> generateDeepLink(@RequestBody DeepLinkRequest request) {
        String link = khqrService.generateDeepLink(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "shortLink", link
        ));
    }

    @PostMapping("/transactions/check")
    public ResponseEntity<CheckTransactionResponse> checkTransactionByMd5(
            @RequestBody CheckTransactionRequest request
    ) {
        CheckTransactionResponse response = khqrService.checkTransactionByMd5(request.getMd5());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/check-bakong-account")
    public ResponseEntity<CheckBakongAccountResponse> checkBakongAccount(
            @Valid @RequestBody CheckBakongAccountRequest request
    ) {
        CheckBakongAccountResponse response = khqrService.checkBakongAccount(request.getAccountId());
        return ResponseEntity.ok(response);
    }
}
