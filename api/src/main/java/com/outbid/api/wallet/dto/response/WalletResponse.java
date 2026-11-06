package com.outbid.api.wallet.dto.response;

import com.outbid.api.wallet.model.Wallet;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record WalletResponse(
        UUID id, BigDecimal balance, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
    public static WalletResponse from(Wallet wallet) {
        return new WalletResponse(
                wallet.getId(), wallet.getBalance(), wallet.getCreatedAt(), wallet.getUpdatedAt());
    }
}
