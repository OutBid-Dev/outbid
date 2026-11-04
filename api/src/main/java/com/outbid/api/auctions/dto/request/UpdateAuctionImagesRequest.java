package com.outbid.api.auctions.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record UpdateAuctionImagesRequest(@Valid List<ImageOperation> operations) {

    public record ImageOperation(
            @NotNull ImageOperationType operation,
            UUID imageId,
            @Size(max = 2048) String imageUrl,
            Integer displayOrder) {}

    public enum ImageOperationType {
        ADD,
        REPLACE,
        REMOVE,
        REORDER
    }
}
