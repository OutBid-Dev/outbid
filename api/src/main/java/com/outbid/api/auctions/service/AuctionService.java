package com.outbid.api.auctions.service;

import com.outbid.api.auctions.dto.request.AuctionSearchRequest;
import com.outbid.api.auctions.dto.request.CreateAuctionRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionCategoriesRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionImagesRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionSpecificationsRequest;
import com.outbid.api.auctions.dto.response.AuctionResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;

public interface AuctionService {
    AuctionResponse createAuction(CreateAuctionRequest request, UUID sellerId);

    List<AuctionResponse> getAllAuctions();

    List<AuctionResponse> getPublicAuctions();

    List<AuctionResponse> getMyAuctions(UUID authenticatedSellerId);

    List<AuctionResponse> getAuctionsBySeller(UUID sellerId);

    AuctionResponse getVisibleAuctionById(UUID id, UUID viewerId, boolean admin);

    Page<AuctionResponse> searchAuctions(
            AuctionSearchRequest request, UUID sellerId, boolean includeDrafts);

    AuctionResponse updateAuction(UUID auctionId, UpdateAuctionRequest request, UUID sellerId);

    AuctionResponse updateAuctionImages(
            UUID auctionId, UpdateAuctionImagesRequest request, UUID sellerId);

    AuctionResponse updateAuctionCategories(
            UUID auctionId, UpdateAuctionCategoriesRequest request, UUID sellerId);

    AuctionResponse updateAuctionSpecifications(
            UUID auctionId, UpdateAuctionSpecificationsRequest request, UUID sellerId);

    void deleteAuction(UUID auctionId, UUID requesterId, boolean admin);
}
