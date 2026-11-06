package com.outbid.api.auctions.controller;

import com.outbid.api.auctions.dto.request.CreateAuctionCategoryRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionCategoryRequest;
import com.outbid.api.auctions.dto.response.AuctionCategoryPageResponse;
import com.outbid.api.auctions.dto.response.AuctionCategoryResponse;
import com.outbid.api.auctions.service.AuctionCategoryService;
import com.outbid.api.common.reponse.ApiResponse;
import com.outbid.api.common.security.AuthorizationService;
import jakarta.validation.Valid;
import java.util.UUID;
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

@RestController
@RequestMapping("/auction-categories")
public class AuctionCategoryController {
    private final AuthorizationService authorizationService;
    private final AuctionCategoryService auctionCategoryService;

    public AuctionCategoryController(
            AuthorizationService authorizationService,
            AuctionCategoryService auctionCategoryService) {
        this.authorizationService = authorizationService;
        this.auctionCategoryService = auctionCategoryService;
    }

    @PostMapping()
    public ResponseEntity<ApiResponse<AuctionCategoryResponse>> createCategory(
            Authentication authentication,
            @Valid @RequestBody CreateAuctionCategoryRequest request) {

        authorizationService.requireAdmin(authentication);

        AuctionCategoryResponse auctionCategory = auctionCategoryService.createCategory(request);

        return ApiResponse.success(
                HttpStatus.CREATED,
                String.format("Created category %s successfully!", request.name()),
                auctionCategory);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<AuctionCategoryPageResponse>> getCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        AuctionCategoryPageResponse categories =
                auctionCategoryService.getCategories(page, size, search, sortBy, sortDir);

        return ApiResponse.success(
                HttpStatus.OK, "Auction categories retrieved successfully!", categories);
    }

    @GetMapping("/{categoryID}")
    public ResponseEntity<ApiResponse<AuctionCategoryResponse>> getCategoryById(
            @PathVariable UUID categoryID) {

        AuctionCategoryResponse category = auctionCategoryService.getCategoryById(categoryID);

        return ApiResponse.success(
                HttpStatus.OK, "Auction category retrieved successfully!", category);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<AuctionCategoryResponse>> updateCategory(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAuctionCategoryRequest request) {

        authorizationService.requireAdmin(authentication);

        AuctionCategoryResponse category = auctionCategoryService.updateCategory(id, request);

        return ApiResponse.success(
                HttpStatus.OK, "Auction category updated successfully!", category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            Authentication authentication, @PathVariable UUID id) {

        authorizationService.requireAdmin(authentication);

        auctionCategoryService.deleteCategory(id);

        return ApiResponse.success(HttpStatus.OK, "Auction category deleted successfully!");
    }
}
