package com.outbid.api.common.reponse;

public record ApiResponse<T>(boolean success, String response, T data) {
  public static <T> ApiResponse<T> success(String message, T data) {
    return new ApiResponse<>(true, message, data);
  }

  public static ApiResponse<Void> success(String message) {
    return new ApiResponse<>(true, message, null);
  }
}
