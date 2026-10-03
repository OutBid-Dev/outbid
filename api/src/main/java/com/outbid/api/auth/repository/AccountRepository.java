package com.outbid.api.auth.repository;

import com.outbid.api.auth.model.Account;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, UUID> {
    Optional<Account> findByAccountId(String accountId);

    Optional<Account> findByUserId(UUID userId);

    Optional<Account> findByUserIdAndProviderId(UUID userId, String providerId);

    boolean existsByUserId(UUID userId);

    List<Account> findAllByRefreshTokenIsNotNull();
}
