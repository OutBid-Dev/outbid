package com.outbid.api.users.service;

import com.outbid.api.auth.dto.response.UserResponse;
import java.util.UUID;

public interface UserService {
    UserResponse getCurrentUser(UUID userId);
}
