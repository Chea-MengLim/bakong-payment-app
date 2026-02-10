package com.example.bakongservice.exception;

public class ResourceNotFoundExceptionHandler extends RuntimeException{
    public ResourceNotFoundExceptionHandler(String message) {
        super(message);
    }
}
