package com.outbid.api.auctions.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateAuctionCategoryRequest(
        @NotBlank(message = "Category name is required") @Size(max = 150) String name,
        String description) {}
