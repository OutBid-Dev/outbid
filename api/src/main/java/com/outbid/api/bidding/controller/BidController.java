package com.outbid.api.bidding.controller;

import com.outbid.api.bidding.dto.request.PlaceBidRequest;
import com.outbid.api.bidding.dto.response.AuctionTimelineResponse;
import com.outbid.api.bidding.dto.response.BidResponse;
import com.outbid.api.bidding.dto.response.BiddingStateResponse;
import com.outbid.api.bidding.service.BidService;
import com.outbid.api.common.reponse.ApiResponse;
import com.outbid.api.common.security.AuthorizationService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auctions/{auctionId}")
public class BidController {
    private final BidService bidService;
    private final AuthorizationService authorizationService;

    public BidController(BidService bidService, AuthorizationService authorizationService) {
        this.bidService = bidService;
        this.authorizationService = authorizationService;
    }

    @PostMapping("/bids")
    public ResponseEntity<ApiResponse<BidResponse>> placeBid(
            @PathVariable UUID auctionId,
            @Valid @RequestBody PlaceBidRequest request,
            Authentication authentication) {

        UUID bidderId = authorizationService.getOptionalAuthenticatedUserId(authentication);

        BidResponse response = bidService.placeBid(auctionId, bidderId, request.amount());

        return ApiResponse.success(HttpStatus.CREATED, "Bid placed successfully", response);
    }

    @GetMapping("/bids/state")
    public ResponseEntity<ApiResponse<BiddingStateResponse>> getBiddingState(
            @PathVariable UUID auctionId) {

        BiddingStateResponse response = bidService.getBiddingState(auctionId);

        return ApiResponse.success(HttpStatus.OK, "Bidding state retrieved successfully", response);
    }

    @GetMapping("/bids")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<BidResponse>>>
            getBidHistory(
                    @PathVariable UUID auctionId,
                    @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC)
                            Pageable pageable) {

        var response = bidService.getBidHistory(auctionId, pageable);

        return ApiResponse.success(HttpStatus.OK, "Bid history retrieved successfully", response);
    }

    @GetMapping("/bids/timeline")
    public ResponseEntity<ApiResponse<AuctionTimelineResponse>> getAuctionTimeline(
            @PathVariable UUID auctionId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC)
                    Pageable pageable) {

        AuctionTimelineResponse response = bidService.getAuctionTimeline(auctionId, pageable);

        return ApiResponse.success(
                HttpStatus.OK, "Auction timeline retrieved successfully", response);
    }
}
