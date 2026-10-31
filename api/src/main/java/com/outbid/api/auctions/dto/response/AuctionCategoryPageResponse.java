package com.outbid.api.auctions.dto.response;

import java.util.List;

public record AuctionCategoryPageResponse(
        List<AuctionCategoryResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last,
        String sortBy,
        String sortDir,
        String search) {}
