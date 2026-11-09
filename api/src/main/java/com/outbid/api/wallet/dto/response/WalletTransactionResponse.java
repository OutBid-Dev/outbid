package com.outbid.api.wallet.dto.response;

import com.outbid.api.wallet.model.WalletTransaction;
import com.outbid.api.wallet.model.WalletTransactionType;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record WalletTransactionResponse(
        UUID id,
        WalletTransactionType type,
        BigDecimal amount,
        String referenceType,
        UUID referenceId,
        String description,
        OffsetDateTime createdAt) {
    public static WalletTransactionResponse from(WalletTransaction walletTransaction) {
        return new WalletTransactionResponse(
                walletTransaction.getId(),
                walletTransaction.getType(),
                walletTransaction.getAmount(),
                walletTransaction.getReferenceType(),
                walletTransaction.getReferenceId(),
                walletTransaction.getDescription(),
                walletTransaction.getCreatedAt());
    }
}
