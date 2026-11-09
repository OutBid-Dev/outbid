package com.outbid.api.auth.controller;

import com.outbid.api.auth.dto.request.ChangePasswordRequest;
import com.outbid.api.auth.dto.request.LoginRequest;
import com.outbid.api.auth.dto.request.RegisterRequest;
import com.outbid.api.auth.dto.response.AuthResponse;
import com.outbid.api.auth.dto.response.UserResponse;
import com.outbid.api.auth.security.AuthCookie;
import com.outbid.api.auth.service.AuthService;
import com.outbid.api.common.reponse.ApiResponse;
import com.outbid.api.common.security.AuthorizationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final AuthCookie authCookie;
    private final AuthorizationService authorizationService;

    public AuthController(
            AuthService authService,
            AuthCookie authCookie,
            AuthorizationService authorizationService) {
        this.authService = authService;
        this.authCookie = authCookie;
        this.authorizationService = authorizationService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        AuthResponse result = authService.register(request);

        response.addHeader(
                HttpHeaders.SET_COOKIE, authCookie.accessToken(result.accessToken()).toString());

        response.addHeader(
                HttpHeaders.SET_COOKIE, authCookie.refreshToken(result.refreshToken()).toString());

        return ApiResponse.success(
                HttpStatus.CREATED, "User registered successfully", result.user());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(
            @Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse result = authService.login(request);

        response.addHeader(
                HttpHeaders.SET_COOKIE, authCookie.accessToken(result.accessToken()).toString());

        response.addHeader(
                HttpHeaders.SET_COOKIE, authCookie.refreshToken(result.refreshToken()).toString());

        return ApiResponse.success(
                HttpStatus.CREATED, "User logged in successfully", result.user());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = getRefreshToken(request);

        authService.logout(refreshToken);

        response.addHeader(HttpHeaders.SET_COOKIE, authCookie.clearAccessToken().toString());

        response.addHeader(HttpHeaders.SET_COOKIE, authCookie.clearRefreshToken().toString());

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = getRefreshToken(request);

        String accessToken = authService.refresh(refreshToken);

        response.addHeader(HttpHeaders.SET_COOKIE, authCookie.accessToken(accessToken).toString());

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication,
            HttpServletResponse response) {
        UUID userId = authorizationService.getOptionalAuthenticatedUserId(authentication);

        authService.changePassword(userId, request);

        response.addHeader(HttpHeaders.SET_COOKIE, authCookie.clearAccessToken().toString());
        response.addHeader(HttpHeaders.SET_COOKIE, authCookie.clearRefreshToken().toString());

        return ResponseEntity.noContent().build();
    }

    private String getRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if ("refresh_token".equals(cookie.getName())) {
                String token = cookie.getValue();

                if (token != null && !token.isBlank()) {
                    return token;
                }

                return null;
            }
        }

        return null;
    }
}
