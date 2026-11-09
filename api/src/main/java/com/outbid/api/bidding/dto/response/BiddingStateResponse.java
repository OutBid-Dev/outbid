package com.outbid.api.bidding.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record BiddingStateResponse(
        UUID auctionId,
        BigDecimal currentPrice,
        BigDecimal minimumBidIncrement,
        BigDecimal minimumNextBid,
        long totalBids) {}
