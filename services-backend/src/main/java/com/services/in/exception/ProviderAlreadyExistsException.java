package com.services.in.exception;

import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ProviderAlreadyExistsException extends RuntimeException {

    public ProviderAlreadyExistsException(String message) {
        super(message);
    }
}
