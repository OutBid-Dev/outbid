package com.outbid.api.auth.service;

import com.outbid.api.auth.model.Account;
import com.outbid.api.auth.model.User;
import com.outbid.api.auth.repository.AccountRepository;
import com.outbid.api.common.exceptions.BadRequestException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final Duration refreshTokenExpiration;

    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenServiceImpl(
            AccountRepository accountRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.jwt.refresh-token-expiration}") Duration refreshTokenExpiration) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    @Transactional
    public String create(User user) {
        Account account =
                accountRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() -> new BadRequestException("Invalid account"));

        String token = generateToken();

        account.setRefreshToken(passwordEncoder.encode(token));
        account.setRefreshTokenExpiresAt(Instant.now().plus(refreshTokenExpiration));
        account.setUpdatedAt(Instant.now());

        accountRepository.save(account);

        return token;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Account> validateRefreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return Optional.empty();
        }

        Instant now = Instant.now();

        return accountRepository.findAllByRefreshTokenIsNotNull().stream()
                .filter(account -> account.getRefreshTokenExpiresAt() != null)
                .filter(account -> account.getRefreshTokenExpiresAt().isAfter(now))
                .filter(account -> passwordEncoder.matches(refreshToken, account.getRefreshToken()))
                .findFirst();
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
