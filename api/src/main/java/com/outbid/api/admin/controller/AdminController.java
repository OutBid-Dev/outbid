package com.outbid.api.admin.controller;

import com.outbid.api.admin.dto.request.RejectSellerApplicationRequest;
import com.outbid.api.admin.dto.response.AdminSellerApplicationResponse;
import com.outbid.api.admin.service.AdminService;
import com.outbid.api.common.reponse.ApiResponse;
import com.outbid.api.common.security.AuthorizationService;
import com.outbid.api.sellers.dto.response.SellerApplicationResponse;
import com.outbid.api.sellers.dto.response.SellerApplicationSummaryResponse;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;
    private final AuthorizationService authorizationService;

    public AdminController(AdminService adminService, AuthorizationService authorizationService) {
        this.adminService = adminService;
        this.authorizationService = authorizationService;
    }

    @GetMapping("/seller-applications")
    public ResponseEntity<ApiResponse<List<SellerApplicationSummaryResponse>>>
            getSellerApplications(Authentication authentication) {

        authorizationService.requireAdmin(authentication);

        List<SellerApplicationSummaryResponse> response = adminService.getSellerApplications();

        return ApiResponse.success(
                HttpStatus.OK, "Seller application retrieved successfully", response);
    }

    @GetMapping("/seller-applications/{applicationId}")
    public ResponseEntity<ApiResponse<AdminSellerApplicationResponse>> getSellerApplication(
            @PathVariable UUID applicationId, Authentication authentication) {
        authorizationService.requireAdmin(authentication);

        AdminSellerApplicationResponse response = adminService.getSellerApplication(applicationId);

        return ApiResponse.success(
                HttpStatus.OK, "Seller application retrieved successfully", response);
    }

    @PatchMapping("/seller-applications/{id}/approve")
    public ResponseEntity<ApiResponse<SellerApplicationResponse>> approveSellerApplication(
            @PathVariable UUID id, Authentication authentication) {
        UUID adminId = authorizationService.requireAdmin(authentication);

        SellerApplicationResponse response = adminService.approveSellerApplication(adminId, id);

        return ApiResponse.success(
                HttpStatus.OK, "Seller application approved successfully", response);
    }

    @PatchMapping("/seller-applications/{id}/reject")
    public ResponseEntity<ApiResponse<SellerApplicationResponse>> rejectSellerApplication(
            @PathVariable UUID id,
            @Valid @RequestBody RejectSellerApplicationRequest request,
            Authentication authentication) {
        UUID adminId = authorizationService.requireAdmin(authentication);

        SellerApplicationResponse response =
                adminService.rejectSellerApplication(adminId, id, request.rejectionReason());

        return ApiResponse.success(
                HttpStatus.OK, "Seller application rejected successfully", response);
    }
}
