package com.outbid.api.sellers.controller;

import com.outbid.api.common.reponse.ApiResponse;
import com.outbid.api.common.security.AuthorizationService;
import com.outbid.api.sellers.dto.request.SellerApplicationRequest;
import com.outbid.api.sellers.dto.response.SellerApplicationResponse;
import com.outbid.api.sellers.dto.response.SellerApplicationSummaryResponse;
import com.outbid.api.sellers.service.SellerService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/seller")
public class SellerController {
    private final SellerService sellerService;
    private final AuthorizationService authorizationService;

    public SellerController(
            SellerService sellerService, AuthorizationService authorizationService) {
        this.sellerService = sellerService;
        this.authorizationService = authorizationService;
    }

    @PostMapping("/apply")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ApiResponse<SellerApplicationResponse>> apply(
            @Valid @RequestBody SellerApplicationRequest request, Authentication authentication) {
        UUID userId = authorizationService.getOptionalAuthenticatedUserId(authentication);

        SellerApplicationResponse response = sellerService.apply(userId, request);

        return ApiResponse.success(
                HttpStatus.CREATED, "Seller application submitted successfully", response);
    }

    @GetMapping("/apply")
    public ResponseEntity<ApiResponse<List<SellerApplicationSummaryResponse>>> getApplications(
            Authentication authentication) {
        UUID userId = authorizationService.getOptionalAuthenticatedUserId(authentication);

        List<SellerApplicationSummaryResponse> response = sellerService.getApplications(userId);

        return ApiResponse.success(
                HttpStatus.OK, "Seller applications retrieved successfully", response);
    }

    @GetMapping("/apply/{applicationId}")
    public ResponseEntity<ApiResponse<SellerApplicationResponse>> getApplicationById(
            Authentication authentication, @PathVariable UUID applicationId) {
        UUID userId = authorizationService.getOptionalAuthenticatedUserId(authentication);

        SellerApplicationResponse response = sellerService.getApplication(userId, applicationId);

        return ApiResponse.success(
                HttpStatus.OK, "Seller application retrieved successfully", response);
    }
}
