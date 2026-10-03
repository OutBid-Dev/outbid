package com.outbid.api.users.dto.request;

import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @Size(max = 50) String firstName, @Size(max = 50) String lastName, String image) {}
