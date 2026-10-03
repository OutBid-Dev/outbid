package com.outbid.api.users.service;

import com.outbid.api.auth.dto.response.UserResponse;
import com.outbid.api.users.dto.request.UpdateUserRequest;
import java.util.UUID;

public interface UserService {
    UserResponse getCurrentUser(UUID userId);

    UserResponse getUserById(UUID userId);

    UserResponse updateCurrentUser(UUID userId, UpdateUserRequest updateUserRequest);
}
