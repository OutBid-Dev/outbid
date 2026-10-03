package com.outbid.api.users.dto.response;

import com.outbid.api.auth.model.UserRole;
import java.time.Instant;
import java.util.UUID;

public record PublicUserResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String image,
        UserRole role,
        Instant createdAt) {}
