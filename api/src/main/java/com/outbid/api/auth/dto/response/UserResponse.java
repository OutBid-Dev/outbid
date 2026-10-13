package com.outbid.api.auth.dto.response;

import com.outbid.api.auth.model.UserRole;
import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        Boolean emailVerified,
        String image,
        UserRole role,
        Instant createdAt,
        Instant updatedAt) {}
