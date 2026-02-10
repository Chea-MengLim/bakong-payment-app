package com.example.bakongservice.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeepLinkRequest {
    @Schema(
            description = "API URL",
            example = "http://api.example.com/v1/generate_deeplink_by_qr"
    )
    private String url;
    private String qr;
    @Schema(
            description = "App Name",
            example = "Example App"
    )
    private String appName;
    @Schema(
            description = "App Icon URL",
            example = "http://cdn.example.com/icons.logo.png"
    )
    private String appIconUrl;
    @Schema(
            description = "App Deeplink Callback",
            example = "http://app.example.com"
    )
    private String appDeepLinkCallback;
}
