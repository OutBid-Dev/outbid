package com.outbid.api.auth.security;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class AuthCookie {
    private static final String ACCESS_TOKEN_COOKIE = "access_token";
    private static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    private final Duration accessTokenExpiration;
    private final Duration refreshTokenExpiration;
    private final boolean secure;
    private final String sameSite;

    public AuthCookie(
            @Value("${app.jwt.access-token-expiration}") Duration accessTokenExpiration,
            @Value("${app.jwt.refresh-token-expiration}") Duration refreshTokenExpiration,
            @Value("${app.cookie.secure}") boolean isSecure,
            @Value("${app.cookie.same-site}") String sameSite) {
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
        this.secure = isSecure;
        this.sameSite = sameSite;
    }

    public ResponseCookie accessToken(String token) {
        return ResponseCookie.from(ACCESS_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(accessTokenExpiration)
                .build();
    }

    public ResponseCookie refreshToken(String token) {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/api/v1/auth")
                .maxAge(refreshTokenExpiration)
                .build();
    }

    public ResponseCookie clearAccessToken() {
        return ResponseCookie.from(ACCESS_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ZERO)
                .build();
    }

    public ResponseCookie clearRefreshToken() {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/api/v1/auth")
                .maxAge(Duration.ZERO)
                .build();
    }
}
