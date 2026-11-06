package com.outbid.api.users.controller;

import com.outbid.api.auth.dto.response.UserResponse;
import com.outbid.api.common.reponse.ApiResponse;
import com.outbid.api.common.security.AuthorizationService;
import com.outbid.api.users.dto.request.UpdateUserRequest;
import com.outbid.api.users.dto.response.PublicUserResponse;
import com.outbid.api.users.service.UserService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private final UserService userService;
    private final AuthorizationService authorizationService;

    public UserController(UserService userService, AuthorizationService authorizationService) {
        this.userService = userService;
        this.authorizationService = authorizationService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(Authentication authentication) {
        UUID userId = authorizationService.getOptionalAuthenticatedUserId(authentication);

        UserResponse response = userService.getCurrentUser(userId);

        return ApiResponse.success(HttpStatus.OK, "User retrieved successfully", response);
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @Valid @RequestBody UpdateUserRequest request, Authentication authentication) {
        UUID userId = authorizationService.getOptionalAuthenticatedUserId(authentication);

        UserResponse response = userService.updateCurrentUser(userId, request);

        return ApiResponse.success(HttpStatus.OK, "User updated successfully", response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<PublicUserResponse>> getUserById(@PathVariable UUID userId) {
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

        return ApiResponse.success(
                HttpStatus.OK, "User retrieved successfully", publicUserResponse);
    }
}
