package com.outbid.api.auth.service;

import com.outbid.api.auth.dto.request.ChangePasswordRequest;
import com.outbid.api.auth.dto.request.LoginRequest;
import com.outbid.api.auth.dto.request.RegisterRequest;
import com.outbid.api.auth.dto.response.AuthResponse;
import com.outbid.api.auth.dto.response.UserResponse;
import com.outbid.api.auth.model.Account;
import com.outbid.api.auth.model.User;
import com.outbid.api.auth.repository.AccountRepository;
import com.outbid.api.auth.repository.UserRepository;
import com.outbid.api.auth.security.JWTService;
import com.outbid.api.common.exceptions.BadRequestException;
import com.outbid.api.common.exceptions.UnauthorizedException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthServiceImpl(UserRepository userRepository, AccountRepository accountRepository,
                    PasswordEncoder passwordEncoder, JWTService jwtService,
                    RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("user with that email already exists");
        }

        Instant now = Instant.now();

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setEmailVerified(false);
        user.setImage(request.image());
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        User savedUser = userRepository.save(user);

        Account account = new Account();
        account.setId(UUID.randomUUID());
        account.setUser(savedUser);
        account.setAccountId(savedUser.getId().toString());
        account.setProviderId("credential");
        account.setPassword(passwordEncoder.encode(request.password()));
        account.setCreatedAt(now);
        account.setUpdatedAt(now);

        accountRepository.save(account);

        String accessToken = jwtService.generateAccessToken(savedUser);
        String refreshToken = refreshTokenService.create(savedUser);

        UserResponse userResponse = new UserResponse(savedUser.getId(), savedUser.getFirstName(),
                        savedUser.getLastName(), savedUser.getEmail(), savedUser.getEmailVerified(),
                        savedUser.getImage(), savedUser.getCreatedAt(), savedUser.getUpdatedAt());

        return new AuthResponse(userResponse, accessToken, refreshToken);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                        .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        Account account = accountRepository.findByUserId(user.getId())
                        .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        boolean isPasswordCorrect = passwordEncoder.matches(request.password(),
                        account.getPassword());
        if (!isPasswordCorrect) {
            throw new BadRequestException("Invalid email or password");
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = refreshTokenService.create(user);

        UserResponse userResponse = new UserResponse(user.getId(), user.getFirstName(),
                        user.getLastName(), user.getEmail(), user.getEmailVerified(),
                        user.getImage(), user.getCreatedAt(), user.getUpdatedAt());

        return new AuthResponse(userResponse, accessToken, refreshToken);
    }

    @Override
    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }

        List<Account> accounts = accountRepository.findAllByRefreshTokenIsNotNull();

        for (Account account : accounts) {
            String storedRefreshToken = account.getRefreshToken();

            if (storedRefreshToken != null
                            && passwordEncoder.matches(refreshToken, storedRefreshToken)) {

                account.setRefreshToken(null);
                account.setRefreshTokenExpiresAt(null);
                account.setUpdatedAt(Instant.now());

                accountRepository.save(account);

                return;
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public String refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        Account account = refreshTokenService.validateRefreshToken(refreshToken).orElseThrow(
                        () -> new UnauthorizedException("Invalid or expired refresh token"));

        User user = account.getUser();

        return jwtService.generateAccessToken(user);
    }

    @Override
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        Account account = accountRepository.findByUserIdAndProviderId(userId, "credential")
                        .orElseThrow(() -> new BadRequestException(
                                        "Password change is not available for this account"));

        boolean currentPasswordCorrect = passwordEncoder.matches(request.currentPassword(),
                        account.getPassword());

        if (!currentPasswordCorrect) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        if (passwordEncoder.matches(request.newPassword(), account.getPassword())) {
            throw new BadRequestException("New password must be different from current password");
        }

        account.setPassword(passwordEncoder.encode(request.newPassword()));
        account.setRefreshToken(null);
        account.setRefreshTokenExpiresAt(null);
        account.setUpdatedAt(Instant.now());

        accountRepository.save(account);
    }
}
