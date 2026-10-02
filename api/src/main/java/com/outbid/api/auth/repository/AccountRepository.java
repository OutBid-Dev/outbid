package com.outbid.api.auth.repository;

import com.outbid.api.auth.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {
    Optional<Account> findByAccountId(String accountId);

    Optional<Account> findByUserId(UUID userId);

    Optional<Account> findByUserIdAndProviderId(UUID userId, String providerId);

    boolean existsByUserId(UUID userId);

    List<Account> findAllByRefreshTokenIsNotNull();
}
