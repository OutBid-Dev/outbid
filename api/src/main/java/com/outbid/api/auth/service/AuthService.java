package com.outbid.api.auth.service;

import com.outbid.api.auth.dto.request.LoginRequest;
import com.outbid.api.auth.dto.request.RegisterRequest;
import com.outbid.api.auth.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void logout(String refreshToken);
}
