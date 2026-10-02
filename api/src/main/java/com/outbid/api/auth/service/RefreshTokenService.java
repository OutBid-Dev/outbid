package com.outbid.api.auth.service;

import com.outbid.api.auth.model.Account;
import com.outbid.api.auth.model.User;

import java.util.Optional;

public interface RefreshTokenService {
    String create(User user);

    Optional<Account> validateRefreshToken(String refreshToken);
}
