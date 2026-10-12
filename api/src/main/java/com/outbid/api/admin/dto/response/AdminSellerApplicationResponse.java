package com.outbid.api.admin.dto.response;

import com.outbid.api.sellers.dto.response.SellerApplicationResponse;
import com.outbid.api.sellers.model.SellerApplication;
import com.outbid.api.sellers.model.SellerApplicationStatus;
import java.time.Instant;
import java.util.UUID;

public record AdminSellerApplicationResponse(
        UUID id,
        SellerApplicationStatus status,
        String reason,
        ApplicantDetailsResponse applicant,
        SellerApplicationResponse.ReviewerResponse reviewedBy,
        Instant reviewedAt,
        String rejectionReason,
        Instant createdAt,
        Instant updatedAt) {
    public static AdminSellerApplicationResponse from(SellerApplication application) {
        return new AdminSellerApplicationResponse(
                application.getId(),
                application.getStatus(),
                application.getReason(),
                ApplicantDetailsResponse.from(application.getUser()),
                application.getReviewedBy() == null
                        ? null
                        : new SellerApplicationResponse.ReviewerResponse(
                                application.getReviewedBy().getId(),
                                application.getReviewedBy().getFirstName()
                                        + " "
                                        + application.getReviewedBy().getLastName()),
                application.getReviewedAt(),
                application.getRejectionReason(),
                application.getCreatedAt(),
                application.getUpdatedAt());
    }
}
