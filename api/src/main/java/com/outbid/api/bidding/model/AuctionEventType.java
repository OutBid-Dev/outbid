package com.outbid.api.bidding.model;

public enum AuctionEventType {
    BID_PLACED,
    BID_INCREASED,
    OUTBID,
    AUCTION_STARTED,
    AUCTION_ENDED,
    WINNER_DECLARED,
    SETTLEMENT_COMPLETED,
    SETTLEMENT_FAILED
}
