package com.outbid.api.auth.service;

import com.outbid.api.auth.dto.request.ChangePasswordRequest;
import com.outbid.api.auth.dto.request.LoginRequest;
import com.outbid.api.auth.dto.request.RegisterRequest;
import com.outbid.api.auth.dto.response.AuthResponse;

import java.util.UUID;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void logout(String refreshToken);

    String refresh(String refreshToken);

    void changePassword(UUID userId, ChangePasswordRequest request);
}
