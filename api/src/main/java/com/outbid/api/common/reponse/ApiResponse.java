package com.outbid.api.common.reponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public record ApiResponse<T>(boolean success, int statusCode, String response, T data) {

    public static <T> ResponseEntity<ApiResponse<T>> success(
            HttpStatus status, String message, T data) {

        return ResponseEntity.status(status)
                .body(new ApiResponse<>(true, status.value(), message, data));
    }

    public static ResponseEntity<ApiResponse<Void>> success(HttpStatus status, String message) {

        return ResponseEntity.status(status)
                .body(new ApiResponse<>(true, status.value(), message, null));
    }

    public static <T> ResponseEntity<ApiResponse<T>> error(
            HttpStatus status, String message, T data) {

        return ResponseEntity.status(status)
                .body(new ApiResponse<>(false, status.value(), message, data));
    }

    public static ResponseEntity<ApiResponse<Void>> error(HttpStatus status, String message) {

        return ResponseEntity.status(status)
                .body(new ApiResponse<>(false, status.value(), message, null));
    }
}
