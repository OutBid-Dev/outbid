package com.outbid.api.users.controller;

import com.outbid.api.auth.dto.response.UserResponse;
import com.outbid.api.auth.repository.UserRepository;
import com.outbid.api.common.exceptions.UnauthorizedException;
import com.outbid.api.common.reponse.ApiResponse;
import com.outbid.api.users.service.UserService;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
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
    public ApiResponse<UserResponse> me(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID userId)) {
            throw new UnauthorizedException("Invalid authentication");
        }

        UserResponse response = userService.getCurrentUser(userId);

        return ApiResponse.success("User retrieved successfully", response);
    }
}
