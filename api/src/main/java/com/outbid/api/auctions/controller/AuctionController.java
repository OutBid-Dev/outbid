package com.outbid.api.auctions.controller;

import com.outbid.api.auctions.dto.request.AuctionSearchRequest;
import com.outbid.api.auctions.dto.request.CreateAuctionRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionCategoriesRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionImagesRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionSpecificationsRequest;
import com.outbid.api.auctions.dto.response.AuctionResponse;
import com.outbid.api.auctions.model.AuctionItemCondition;
import com.outbid.api.auctions.model.AuctionStatus;
import com.outbid.api.auctions.service.AuctionService;
import com.outbid.api.auth.model.UserRole;
import com.outbid.api.common.reponse.ApiResponse;
import com.outbid.api.common.security.AuthorizationService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
    public ResponseEntity<ApiResponse<Page<AuctionResponse>>> getAllAuctions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) AuctionStatus status,
            @RequestParam(required = false) AuctionItemCondition itemCondition,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction,
            @RequestParam(defaultValue = "false") boolean mine,
            @RequestParam(required = false) UUID sellerId,
            Authentication authentication) {

        if (mine && sellerId != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The mine and sellerId parameters cannot be used together");
        }

        boolean admin = authorizationService.hasRole(authentication, UserRole.ADMIN);

        UUID requestedSellerId = null;
        boolean includeDrafts = false;

        if (mine) {
            requestedSellerId = authorizationService.requireRole(authentication, UserRole.SELLER);

            includeDrafts = true;
        } else if (sellerId != null) {
            authorizationService.requireAdmin(authentication);

            requestedSellerId = sellerId;
            includeDrafts = true;
        } else if (admin) {
            includeDrafts = true;
        }

        AuctionSearchRequest request =
                new AuctionSearchRequest(
                        search,
                        categoryId,
                        status,
                        itemCondition,
                        minPrice,
                        maxPrice,
                        brand,
                        location,
                        page,
                        size,
                        sortBy,
                        direction);

        Page<AuctionResponse> auctions =
                auctionService.searchAuctions(request, requestedSellerId, includeDrafts);

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

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<AuctionResponse>> updateAuction(
            @PathVariable UUID id,
            Authentication authentication,
            @Valid @RequestBody UpdateAuctionRequest request) {

        UUID sellerId = authorizationService.requireRole(authentication, UserRole.SELLER);

        AuctionResponse auction = auctionService.updateAuction(id, request, sellerId);

        return ApiResponse.success(HttpStatus.OK, "Auction details updated successfully", auction);
    }

    @PatchMapping("/{id}/images")
    public ResponseEntity<ApiResponse<AuctionResponse>> updateAuctionImages(
            @PathVariable UUID id,
            Authentication authentication,
            @Valid @RequestBody UpdateAuctionImagesRequest request) {

        UUID sellerId = authorizationService.requireRole(authentication, UserRole.SELLER);

        AuctionResponse auction = auctionService.updateAuctionImages(id, request, sellerId);

        return ApiResponse.success(HttpStatus.OK, "Auction images updated successfully", auction);
    }

    @PatchMapping("/{id}/categories")
    public ResponseEntity<ApiResponse<AuctionResponse>> updateAuctionCategories(
            @PathVariable UUID id,
            Authentication authentication,
            @Valid @RequestBody UpdateAuctionCategoriesRequest request) {

        UUID sellerId = authorizationService.requireRole(authentication, UserRole.SELLER);

        AuctionResponse auction = auctionService.updateAuctionCategories(id, request, sellerId);

        return ApiResponse.success(
                HttpStatus.OK, "Auction categories updated successfully", auction);
    }

    @PatchMapping("/{id}/specifications")
    public ResponseEntity<ApiResponse<AuctionResponse>> updateAuctionSpecifications(
            @PathVariable UUID id,
            Authentication authentication,
            @Valid @RequestBody UpdateAuctionSpecificationsRequest request) {

        UUID sellerId = authorizationService.requireRole(authentication, UserRole.SELLER);

        AuctionResponse auction = auctionService.updateAuctionSpecifications(id, request, sellerId);

        return ApiResponse.success(
                HttpStatus.OK, "Auction specifications updated successfully", auction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAuction(
            @PathVariable UUID id, Authentication authentication) {

        boolean admin = authorizationService.hasRole(authentication, UserRole.ADMIN);

        UUID requesterId =
                admin
                        ? authorizationService.requireAdmin(authentication)
                        : authorizationService.requireRole(authentication, UserRole.SELLER);

        auctionService.deleteAuction(id, requesterId, admin);

        return ApiResponse.success(HttpStatus.OK, "Auction deleted successfully");
    }
}
