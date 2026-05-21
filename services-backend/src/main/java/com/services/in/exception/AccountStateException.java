package com.services.in.exception;

import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class AccountStateException extends RuntimeException {

    public AccountStateException(String message) {
        super(message);
    }
}
