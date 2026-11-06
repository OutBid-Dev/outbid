package com.outbid.api.wallet.service;

import com.outbid.api.wallet.dto.response.WalletResponse;
import com.outbid.api.wallet.dto.response.WalletTransactionResponse;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WalletService {

    WalletResponse getMyWallet(UUID userId);

    WalletResponse deposit(UUID userId, BigDecimal amount);

    Page<WalletTransactionResponse> getTransactions(UUID userId, Pageable pageable);
}
