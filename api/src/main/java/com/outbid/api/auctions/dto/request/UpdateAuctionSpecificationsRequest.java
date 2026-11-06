package com.outbid.api.auctions.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record UpdateAuctionSpecificationsRequest(
        @NotEmpty List<@NotNull SpecificationOperation> operations) {

    public record SpecificationOperation(
            @NotNull SpecificationOperationType operation, @NotBlank String key, Object value) {}

    public enum SpecificationOperationType {
        SET,
        REMOVE,
        CLEAR
    }
}
