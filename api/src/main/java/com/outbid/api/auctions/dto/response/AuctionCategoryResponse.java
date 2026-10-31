package com.outbid.api.auctions.dto.response;

import com.outbid.api.auctions.model.AuctionCategory;
import java.time.Instant;
import java.util.UUID;

public record AuctionCategoryResponse(
        UUID id,
        String name,
        String slug,
        String description,
        Instant createdAt,
        Instant updatedAt) {
    public static AuctionCategoryResponse from(AuctionCategory application) {

        return new AuctionCategoryResponse(
                application.getId(),
                application.getName(),
                application.getSlug(),
                application.getDescription(),
                application.getCreatedAt(),
                application.getUpdatedAt());
    }
}
