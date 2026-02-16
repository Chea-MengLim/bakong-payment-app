package com.example.bakongservice.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response from Bakong check_bakong_account API.
 * responseCode 0 = account exists, responseCode 1 = account does not exist.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckBakongAccountResponse {

    private Integer responseCode;
    private String responseMessage;
    private Integer errorCode;
    private Object data;
}
