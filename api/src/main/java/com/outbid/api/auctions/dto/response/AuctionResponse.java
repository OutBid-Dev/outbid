package com.outbid.api.auctions.dto.response;

import com.outbid.api.auctions.model.Auction;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record AuctionResponse(
        UUID id,
        String title,
        String description,
        String itemCondition,
        String brand,
        String model,
        Map<String, Object> specifications,
        String location,
        BigDecimal startingPrice,
        BigDecimal currentPrice,
        BigDecimal minimumBidIncrement,
        Instant startTime,
        Instant endTime,
        String status,
        UUID sellerId,
        Set<UUID> categoryIds,
        List<AuctionImageResponse> images,
        Instant createdAt,
        Instant updatedAt) {
    public static AuctionResponse from(Auction auction) {
        return new AuctionResponse(
                auction.getId(),
                auction.getTitle(),
                auction.getDescription(),
                auction.getItemCondition().name(),
                auction.getBrand(),
                auction.getModel(),
                auction.getSpecifications(),
                auction.getLocation(),
                auction.getStartingPrice(),
                auction.getCurrentPrice(),
                auction.getMinimumBidIncrement(),
                auction.getStartTime(),
                auction.getEndTime(),
                auction.getStatus().name(),
                auction.getSeller().getId(),
                auction.getCategoryAssignments().stream()
                        .map(assignment -> assignment.getCategory().getId())
                        .collect(Collectors.toSet()),
                auction.getImages().stream().map(AuctionImageResponse::from).toList(),
                auction.getCreatedAt(),
                auction.getUpdatedAt());
    }
}
