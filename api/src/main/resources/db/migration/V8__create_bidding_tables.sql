CREATE TABLE bids
(
    id         UUID PRIMARY KEY        DEFAULT gen_random_uuid(),

    auction_id UUID           NOT NULL
        REFERENCES auctions (id),

    bidder_id  UUID           NOT NULL
        REFERENCES users (id),

    amount     NUMERIC(14, 2) NOT NULL
        CHECK (amount > 0),

    created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bids_auction_created
    ON bids (auction_id, created_at DESC);

CREATE INDEX idx_bids_bidder_created
    ON bids (bidder_id, created_at DESC);

CREATE INDEX idx_bids_auction_amount
    ON bids (auction_id, amount DESC);

CREATE TABLE auction_events
(
    id          UUID PRIMARY KEY     DEFAULT gen_random_uuid(),

    auction_id  UUID        NOT NULL
        REFERENCES auctions (id),

    bid_id      UUID
        REFERENCES bids (id),

    actor_id    UUID
        REFERENCES users (id),

    event_type  VARCHAR(40) NOT NULL
        CHECK (
            event_type IN (
                           'BID_PLACED',
                           'BID_INCREASED',
                           'OUTBID',
                           'AUCTION_STARTED',
                           'AUCTION_ENDED',
                           'WINNER_DECLARED',
                           'SETTLEMENT_COMPLETED',
                           'SETTLEMENT_FAILED'
                )
            ),

    amount      NUMERIC(14, 2) CHECK (amount IS NULL OR amount > 0),

    description VARCHAR(255),

    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_auction_events_auction_created
    ON auction_events (auction_id, created_at DESC);

CREATE INDEX idx_auction_events_bid
    ON auction_events (bid_id)
    WHERE bid_id IS NOT NULL;

CREATE INDEX idx_auction_events_actor_created
    ON auction_events (actor_id, created_at DESC)
    WHERE actor_id IS NOT NULL;