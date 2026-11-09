package com.outbid.api.bidding.dto.response;

import com.outbid.api.bidding.model.AuctionEvent;
import com.outbid.api.bidding.model.AuctionEventType;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record AuctionEventResponse(
        UUID id,
        UUID auctionId,
        UUID bidId,
        UUID actorId,
        AuctionEventType eventType,
        BigDecimal amount,
        String description,
        Instant createdAt) {

    public static AuctionEventResponse from(AuctionEvent event) {
        return new AuctionEventResponse(
                event.getId(),
                event.getAuctionId(),
                event.getBidId(),
                event.getActorId(),
                event.getEventType(),
                event.getAmount(),
                event.getDescription(),
                event.getCreatedAt());
    }
}
