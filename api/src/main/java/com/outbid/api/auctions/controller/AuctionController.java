package com.outbid.api.auctions.controller;

import com.outbid.api.auctions.dto.request.CreateAuctionRequest;
import com.outbid.api.auctions.dto.response.AuctionResponse;
import com.outbid.api.auctions.service.AuctionService;
import com.outbid.api.auth.model.UserRole;
import com.outbid.api.common.reponse.ApiResponse;
import com.outbid.api.common.security.AuthorizationService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auctions")
public class AuctionController {
    private final AuthorizationService authorizationService;
    private final AuctionService auctionService;

    public AuctionController(
            AuthorizationService authorizationService, AuctionService auctionService) {
        this.authorizationService = authorizationService;
        this.auctionService = auctionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AuctionResponse>> createAuction(
            Authentication authentication, @Valid @RequestBody CreateAuctionRequest request) {

        UUID sellerId = authorizationService.requireRole(authentication, UserRole.SELLER);

        AuctionResponse auction = auctionService.createAuction(request, sellerId);

        return ApiResponse.success(HttpStatus.CREATED, "Auction created successfully!", auction);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuctionResponse>>> getAllAuctions(
            Authentication authentication,
            @RequestParam(required = false) Boolean mine,
            @RequestParam(required = false) UUID sellerId) {

        if (Boolean.TRUE.equals(mine) && sellerId != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The mine and sellerId parameters cannot be used together");
        }

        List<AuctionResponse> auctions;

        if (Boolean.TRUE.equals(mine)) {

            UUID authenticatedSellerId =
                    authorizationService.requireRole(authentication, UserRole.SELLER);

            auctions = auctionService.getMyAuctions(authenticatedSellerId);

        } else if (sellerId != null) {

            authorizationService.requireAdmin(authentication);

            auctions = auctionService.getAuctionsBySeller(sellerId);

        } else if (authorizationService.hasRole(authentication, UserRole.ADMIN)) {

            auctions = auctionService.getAllAuctions();

        } else {

            auctions = auctionService.getPublicAuctions();
        }

        return ApiResponse.success(HttpStatus.OK, "Auctions retrieved successfully", auctions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AuctionResponse>> getAuctionById(
            @PathVariable UUID id, Authentication authentication) {

        UUID viewerId = authorizationService.getOptionalAuthenticatedUserId(authentication);

        boolean admin = authorizationService.hasRole(authentication, UserRole.ADMIN);

        AuctionResponse auction = auctionService.getVisibleAuctionById(id, viewerId, admin);

        return ApiResponse.success(HttpStatus.OK, "Auction retrieved successfully", auction);
    }
}
