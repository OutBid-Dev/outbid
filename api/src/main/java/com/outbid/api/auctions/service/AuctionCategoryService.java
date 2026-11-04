package com.outbid.api.auctions.service;

import com.outbid.api.auctions.dto.request.CreateAuctionCategoryRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionCategoryRequest;
import com.outbid.api.auctions.dto.response.AuctionCategoryPageResponse;
import com.outbid.api.auctions.dto.response.AuctionCategoryResponse;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;

public interface AuctionCategoryService {
    AuctionCategoryResponse createCategory(CreateAuctionCategoryRequest request);

    AuctionCategoryPageResponse getCategories(
            int page, int size, String search, String sortBy, String sortDir);

    AuctionCategoryResponse getCategoryById(UUID categoryID);

    @Transactional
    AuctionCategoryResponse updateCategory(UUID id, UpdateAuctionCategoryRequest request);

    @Transactional
    void deleteCategory(UUID id);
}
