package com.outbid.api.common.security;

import com.outbid.api.auth.model.User;
import com.outbid.api.auth.model.UserRole;
import com.outbid.api.auth.repository.UserRepository;
import com.outbid.api.common.exceptions.ForbiddenException;
import com.outbid.api.common.exceptions.ResourceNotFoundException;
import com.outbid.api.common.exceptions.UnauthorizedException;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {
    private final UserRepository userRepository;

    public AuthorizationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UUID requireRole(Authentication authentication, UserRole... allowedRoles) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Authentication is required");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID userId)) {
            throw new UnauthorizedException("Invalid authentication");
        }

        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        for (UserRole allowedRole : allowedRoles) {
            if (user.getRole() == allowedRole) {
                return userId;
            }
        }

        throw new ForbiddenException("You do not have permission to access this resource");
    }

    public UUID requireAdmin(Authentication authentication) {
        return requireRole(authentication, UserRole.ADMIN);
    }

    public UUID requireSellerOrAdmin(Authentication authentication) {
        return requireRole(authentication, UserRole.ADMIN, UserRole.SELLER);
    }
}
