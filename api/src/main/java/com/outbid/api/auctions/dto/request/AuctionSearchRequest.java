package com.outbid.api.auctions.dto.request;

import com.outbid.api.auctions.model.AuctionItemCondition;
import com.outbid.api.auctions.model.AuctionStatus;
import java.math.BigDecimal;
import java.util.UUID;

public record AuctionSearchRequest(
        String search,
        UUID categoryId,
        AuctionStatus status,
        AuctionItemCondition itemCondition,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String brand,
        String location,
        Integer page,
        Integer size,
        String sortBy,
        String direction) {}
