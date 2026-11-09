package com.outbid.api.bidding.service;

import com.outbid.api.bidding.dto.response.AuctionTimelineResponse;
import com.outbid.api.bidding.dto.response.BidResponse;
import com.outbid.api.bidding.dto.response.BiddingStateResponse;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BidService {

    BidResponse placeBid(UUID auctionId, UUID bidderId, java.math.BigDecimal amount);

    BiddingStateResponse getBiddingState(UUID auctionId);

    Page<BidResponse> getBidHistory(UUID auctionId, Pageable pageable);

    AuctionTimelineResponse getAuctionTimeline(UUID auctionId, Pageable pageable);
}
