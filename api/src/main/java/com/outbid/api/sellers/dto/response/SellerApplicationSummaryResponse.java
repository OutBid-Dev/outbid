package com.outbid.api.sellers.dto.response;

import com.outbid.api.sellers.model.SellerApplication;
import com.outbid.api.sellers.model.SellerApplicationStatus;
import java.time.Instant;
import java.util.UUID;

public record SellerApplicationSummaryResponse(
        UUID id, SellerApplicationStatus status, String reason, Instant createdAt) {
    public static SellerApplicationSummaryResponse from(SellerApplication application) {

        return new SellerApplicationSummaryResponse(
                application.getId(),
                application.getStatus(),
                application.getReason(),
                application.getCreatedAt());
    }
}
