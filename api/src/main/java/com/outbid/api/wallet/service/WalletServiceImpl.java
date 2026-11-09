package com.outbid.api.wallet.service;

import com.outbid.api.wallet.dto.response.WalletResponse;
import com.outbid.api.wallet.dto.response.WalletTransactionResponse;
import com.outbid.api.wallet.model.Wallet;
import com.outbid.api.wallet.model.WalletTransaction;
import com.outbid.api.wallet.model.WalletTransactionType;
import com.outbid.api.wallet.repository.WalletRepository;
import com.outbid.api.wallet.repository.WalletTransactionRepository;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WalletServiceImpl implements WalletService {
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;

    public WalletServiceImpl(
            WalletRepository walletRepository,
            WalletTransactionRepository walletTransactionRepository) {
        this.walletRepository = walletRepository;
        this.walletTransactionRepository = walletTransactionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public WalletResponse getMyWallet(UUID userId) {
        Wallet wallet =
                walletRepository
                        .findByUserId(userId)
                        .orElseThrow(() -> new IllegalStateException("Wallet not found"));

        return WalletResponse.from(wallet);
    }

    @Override
    @Transactional
    public WalletResponse deposit(UUID userId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be greater than zero");
        }

        if (amount.scale() > 2) {
            throw new IllegalArgumentException(
                    "Deposit amount cannot have more than 2 decimal places");
        }

        Wallet wallet =
                walletRepository
                        .findByUserIdForUpdate(userId)
                        .orElseThrow(() -> new IllegalStateException("Wallet not found"));

        wallet.setBalance(wallet.getBalance().add(amount));

        WalletTransaction transaction =
                new WalletTransaction(
                        wallet,
                        WalletTransactionType.DEPOSIT,
                        amount,
                        null,
                        null,
                        "Wallet deposit");

        walletRepository.saveAndFlush(wallet);
        walletTransactionRepository.save(transaction);

        return WalletResponse.from(wallet);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WalletTransactionResponse> getTransactions(UUID userId, Pageable pageable) {

        Wallet wallet =
                walletRepository
                        .findByUserId(userId)
                        .orElseThrow(() -> new IllegalStateException("Wallet not found"));

        return walletTransactionRepository
                .findByWalletId(wallet.getId(), pageable)
                .map(WalletTransactionResponse::from);
    }
}
