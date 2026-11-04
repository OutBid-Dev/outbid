package com.outbid.api.auctions.dto.request;

import com.outbid.api.auctions.model.AuctionItemCondition;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;

public record UpdateAuctionRequest(
        @Size(min = 1, max = 150) String title,
        String description,
        AuctionItemCondition itemCondition,
        @Size(max = 100) String brand,
        @Size(max = 100) String model,
        @Size(max = 255) String location,
        @DecimalMin("0.01") BigDecimal startingPrice,
        @DecimalMin("0.01") BigDecimal minimumBidIncrement,
        Instant startTime,
        Instant endTime) {}
