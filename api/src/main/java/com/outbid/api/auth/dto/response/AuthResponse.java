package com.outbid.api.auth.dto.response;

public record AuthResponse(UserResponse user, String accessToken, String refreshToken) {
}
