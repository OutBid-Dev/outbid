package com.outbid.api.users.service;

import com.outbid.api.auth.dto.response.UserResponse;
import com.outbid.api.auth.model.User;
import com.outbid.api.auth.repository.UserRepository;
import com.outbid.api.common.exceptions.ResourceNotFoundException;
import com.outbid.api.users.dto.request.UpdateUserRequest;
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

    @Override
    public UserResponse updateCurrentUser(UUID userId, UpdateUserRequest updateUserRequest) {
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (updateUserRequest.firstName() != null) {
            user.setFirstName(updateUserRequest.firstName());
        }

        if (updateUserRequest.lastName() != null) {
            user.setLastName(updateUserRequest.lastName());
        }

        if (updateUserRequest.image() != null) {
            user.setImage(updateUserRequest.image());
        }

        User updatedUser = userRepository.save(user);

        return new UserResponse(
                updatedUser.getId(),
                updatedUser.getFirstName(),
                updatedUser.getLastName(),
                updatedUser.getEmail(),
                updatedUser.getEmailVerified(),
                updatedUser.getImage(),
                updatedUser.getRole(),
                updatedUser.getCreatedAt(),
                updatedUser.getUpdatedAt());
    }

    @Override
    public UserResponse getUserById(UUID userId) {
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
