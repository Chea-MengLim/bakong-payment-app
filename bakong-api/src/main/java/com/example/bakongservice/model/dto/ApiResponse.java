package com.example.bakongservice.model.dto;

import lombok.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse <T> {

    @Builder.Default
    private LocalDateTime timestamp =  LocalDateTime.now();
    private HttpStatus status;
    private String message;
    private T payload;
}
