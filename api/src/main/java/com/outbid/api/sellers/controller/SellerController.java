package com.outbid.api.sellers.controller;

import com.outbid.api.common.exceptions.UnauthorizedException;
import com.outbid.api.common.reponse.ApiResponse;
import com.outbid.api.sellers.dto.request.SellerApplicationRequest;
import com.outbid.api.sellers.dto.response.SellerApplicationResponse;
import com.outbid.api.sellers.dto.response.SellerApplicationSummaryResponse;
import com.outbid.api.sellers.service.SellerService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
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

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @PostMapping("/apply")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<SellerApplicationResponse> apply(
            @Valid @RequestBody SellerApplicationRequest request, Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID userId)) {
            throw new UnauthorizedException("Invalid authentication");
        }

        SellerApplicationResponse response = sellerService.apply(userId, request);

        return ApiResponse.success("Seller application submitted successfully", response);
    }

    @GetMapping("/apply")
    public ApiResponse<List<SellerApplicationSummaryResponse>> getApplications(
            Authentication authentication) {

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID userId)) {
            throw new UnauthorizedException("Invalid authentication");
        }

        List<SellerApplicationSummaryResponse> response = sellerService.getApplications(userId);

        return ApiResponse.success("Seller applications retrieved successfully", response);
    }

    @GetMapping("/apply/{applicationId}")
    public ApiResponse<SellerApplicationResponse> getApplicationById(
            Authentication authentication, @PathVariable UUID applicationId) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID userId)) {
            throw new UnauthorizedException("Invalid authentication");
        }

        SellerApplicationResponse response = sellerService.getApplication(userId, applicationId);

        return ApiResponse.success("Seller application retrieved successfully", response);
    }
}
