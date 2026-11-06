package com.outbid.api.auctions.dto.response;

import com.outbid.api.auctions.model.AuctionImage;
import java.util.UUID;

public record AuctionImageResponse(
        UUID id, String imageUrl, Integer displayOrder, boolean primary) {

    public static AuctionImageResponse from(AuctionImage image) {
        return new AuctionImageResponse(
                image.getId(), image.getImageUrl(), image.getDisplayOrder(), image.isPrimary());
    }
}
