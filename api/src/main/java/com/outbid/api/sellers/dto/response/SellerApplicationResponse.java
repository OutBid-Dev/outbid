package com.outbid.api.sellers.dto.response;

import com.outbid.api.sellers.model.SellerApplication;
import com.outbid.api.sellers.model.SellerApplicationStatus;
import java.time.Instant;
import java.util.UUID;

public record SellerApplicationResponse(
        UUID id,
        SellerApplicationStatus status,
        String reason,
        ReviewerResponse reviewedBy,
        Instant reviewedAt,
        String rejectionReason,
        Instant createdAt,
        Instant updatedAt) {

    public static SellerApplicationResponse from(SellerApplication application) {
        ReviewerResponse reviewer =
                application.getReviewedBy() == null
                        ? null
                        : new ReviewerResponse(
                                application.getReviewedBy().getId(),
                                application.getReviewedBy().getFirstName()
                                        + " "
                                        + application.getReviewedBy().getLastName());

        return new SellerApplicationResponse(
                application.getId(),
                application.getStatus(),
                application.getReason(),
                reviewer,
                application.getReviewedAt(),
                application.getRejectionReason(),
                application.getCreatedAt(),
                application.getUpdatedAt());
    }

    public record ReviewerResponse(UUID id, String name) {}
}
