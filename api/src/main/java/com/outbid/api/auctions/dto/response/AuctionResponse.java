package com.outbid.api.auctions.dto.response;

import com.outbid.api.auctions.model.Auction;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record AuctionResponse(
        UUID id,
        String title,
        String description,
        BigDecimal startingPrice,
        Instant startTime,
        Instant endTime,
        String status,
        UUID sellerId,
        Set<UUID> categoryIds,
        Instant createdAt,
        Instant updatedAt) {
    public static AuctionResponse from(Auction auction) {
        return new AuctionResponse(
                auction.getId(),
                auction.getTitle(),
                auction.getDescription(),
                auction.getStartingPrice(),
                auction.getStartTime(),
                auction.getEndTime(),
                auction.getStatus().name(),
                auction.getSeller().getId(),
                auction.getCategoryAssignments().stream()
                        .map(assignment -> assignment.getCategory().getId())
                        .collect(Collectors.toSet()),
                auction.getCreatedAt(),
                auction.getUpdatedAt());
    }
}
