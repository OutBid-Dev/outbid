package com.outbid.api.auctions.service;

import com.outbid.api.auctions.dto.request.CreateAuctionRequest;
import com.outbid.api.auctions.dto.response.AuctionResponse;
import java.util.List;
import java.util.UUID;

public interface AuctionService {
    AuctionResponse createAuction(CreateAuctionRequest request, UUID sellerId);

    List<AuctionResponse> getAllAuctions();

    List<AuctionResponse> getPublicAuctions();

    List<AuctionResponse> getMyAuctions(UUID authenticatedSellerId);

    List<AuctionResponse> getAuctionsBySeller(UUID sellerId);

    AuctionResponse getVisibleAuctionById(UUID id, UUID viewerId, boolean admin);
}
