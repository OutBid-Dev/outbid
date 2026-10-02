package com.outbid.api.users.service;

import com.outbid.api.auth.dto.response.UserResponse;
import com.outbid.api.auth.model.User;
import com.outbid.api.auth.repository.UserRepository;
import com.outbid.api.common.exceptions.ResourceNotFoundException;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse getCurrentUser(UUID userId) {
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getEmailVerified(),
                user.getImage(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }
}
