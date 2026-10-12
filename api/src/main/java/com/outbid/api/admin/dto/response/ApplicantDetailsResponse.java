package com.outbid.api.admin.dto.response;

import com.outbid.api.auth.model.User;
import java.time.Instant;
import java.util.UUID;

public record ApplicantDetailsResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String role,
        Instant createdAt,
        Instant updatedAt) {
    public static ApplicantDetailsResponse from(User user) {
        return new ApplicantDetailsResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }
}
