package com.outbid.api.admin.controller;

import com.outbid.api.admin.dto.request.RejectSellerApplicationRequest;
import com.outbid.api.admin.dto.response.AdminSellerApplicationResponse;
import com.outbid.api.admin.service.AdminService;
import com.outbid.api.auth.model.User;
import com.outbid.api.auth.model.UserRole;
import com.outbid.api.auth.repository.UserRepository;
import com.outbid.api.common.exceptions.ForbiddenException;
import com.outbid.api.common.exceptions.ResourceNotFoundException;
import com.outbid.api.common.exceptions.UnauthorizedException;
import com.outbid.api.common.reponse.ApiResponse;
import com.outbid.api.sellers.dto.response.SellerApplicationResponse;
import com.outbid.api.sellers.dto.response.SellerApplicationSummaryResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;
    private final UserRepository userRepository;

    public AdminController(AdminService adminService, UserRepository userRepository) {
        this.adminService = adminService;
        this.userRepository = userRepository;
    }

    @GetMapping("/seller-applications")
    public ApiResponse<List<SellerApplicationSummaryResponse>> getSellerApplications(
            Authentication authentication) {

        requireAdmin(authentication);

        List<SellerApplicationSummaryResponse> response = adminService.getSellerApplications();

        return ApiResponse.success("Seller application retrieved successfully", response);
    }

    @GetMapping("/seller-applications/{applicationId}")
    public ApiResponse<AdminSellerApplicationResponse> getSellerApplication(
            @PathVariable UUID applicationId, Authentication authentication) {
        requireAdmin(authentication);

        AdminSellerApplicationResponse response = adminService.getSellerApplication(applicationId);

        return ApiResponse.success("Seller application retrieved successfully", response);
    }

    @PatchMapping("/seller-applications/{id}/approve")
    public ApiResponse<SellerApplicationResponse> approveSellerApplication(
            @PathVariable UUID id, Authentication authentication) {
        UUID adminId = requireAdmin(authentication);

        SellerApplicationResponse response = adminService.approveSellerApplication(adminId, id);

        return ApiResponse.success("Seller application approved successfully", response);
    }

    @PatchMapping("/seller-applications/{id}/reject")
    public ApiResponse<SellerApplicationResponse> rejectSellerApplication(
            @PathVariable UUID id,
            @Valid @RequestBody RejectSellerApplicationRequest request,
            Authentication authentication) {
        UUID adminId = requireAdmin(authentication);

        SellerApplicationResponse response =
                adminService.rejectSellerApplication(adminId, id, request.rejectionReason());

        return ApiResponse.success("Seller application rejected successfully", response);
    }

    private UUID requireAdmin(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Authentication is required");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID adminId)) {
            throw new UnauthorizedException("Invalid authentication");
        }

        User admin =
                userRepository
                        .findById(adminId)
                        .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        if (admin.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Only admins can access this resource");
        }

        return adminId;
    }
}
