package com.outbid.api.bidding.dto.response;

import com.outbid.api.bidding.model.Bid;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record BidResponse(
        UUID id, UUID auctionId, UUID bidderId, BigDecimal amount, Instant createdAt) {

    public static BidResponse from(Bid bid) {
        return new BidResponse(
                bid.getId(),
                bid.getAuctionId(),
                bid.getBidderId(),
                bid.getAmount(),
                bid.getCreatedAt());
    }
}
