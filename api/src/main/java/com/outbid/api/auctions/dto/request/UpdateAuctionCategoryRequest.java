package com.outbid.api.auctions.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateAuctionCategoryRequest(
        @NotBlank(message = "Category name is required")
                @Size(max = 80, message = "Category name must not exceed 80 characters")
                String name,
        String description) {}
