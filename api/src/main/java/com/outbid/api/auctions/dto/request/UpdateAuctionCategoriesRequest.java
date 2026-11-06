package com.outbid.api.auctions.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record UpdateAuctionCategoriesRequest(
        @NotEmpty List<@NotNull CategoryOperation> operations) {

    public record CategoryOperation(
            @NotNull CategoryOperationType operation, @NotNull UUID categoryId) {}

    public enum CategoryOperationType {
        ADD,
        REMOVE
    }
}
