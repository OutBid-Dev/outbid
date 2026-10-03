package com.outbid.api.users.controller;

import com.outbid.api.auth.dto.response.UserResponse;
import com.outbid.api.auth.repository.UserRepository;
import com.outbid.api.common.exceptions.UnauthorizedException;
import com.outbid.api.common.reponse.ApiResponse;
import com.outbid.api.users.dto.request.UpdateUserRequest;
import com.outbid.api.users.dto.response.PublicUserResponse;
import com.outbid.api.users.service.UserService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> getUser(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID userId)) {
            throw new UnauthorizedException("Invalid authentication");
        }

        UserResponse response = userService.getCurrentUser(userId);

        return ApiResponse.success("User retrieved successfully", response);
    }

    @PatchMapping("/me")
    public ApiResponse<UserResponse> updateUser(
            @Valid @RequestBody UpdateUserRequest request, Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID userId)) {
            throw new UnauthorizedException("Invalid authentication");
        }

        UserResponse response = userService.updateCurrentUser(userId, request);

        return ApiResponse.success("User updated successfully", response);
    }

    @GetMapping("/{userId}")
    public ApiResponse<PublicUserResponse> getUserById(@PathVariable UUID userId) {
        UserResponse userResponse = userService.getUserById(userId);

        PublicUserResponse publicUserResponse =
                new PublicUserResponse(
                        userResponse.id(),
                        userResponse.firstName(),
                        userResponse.lastName(),
                        userResponse.email(),
                        userResponse.image(),
                        userResponse.role(),
                        userResponse.createdAt());

        return ApiResponse.success("User retrieved successfully", publicUserResponse);
    }
}
