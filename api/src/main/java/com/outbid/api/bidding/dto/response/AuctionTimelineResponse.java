package com.outbid.api.bidding.dto.response;

import java.util.List;

public record AuctionTimelineResponse(
        List<AuctionEventResponse> events,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last) {}
