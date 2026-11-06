CREATE TABLE wallets
(
    id         UUID PRIMARY KEY        DEFAULT gen_random_uuid(),

    user_id    UUID           NOT NULL UNIQUE
        REFERENCES users (id) ON DELETE CASCADE,

    balance    NUMERIC(14, 2) NOT NULL DEFAULT 0.00
        CHECK (balance >= 0),

    created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE wallet_transactions
(
    id             UUID PRIMARY KEY        DEFAULT gen_random_uuid(),

    wallet_id      UUID           NOT NULL
        REFERENCES wallets (id),

    type           VARCHAR(30)    NOT NULL
        CHECK (type IN (
                        'DEPOSIT',
                        'AUCTION_PAYMENT',
                        'REFUND'
            )),

    amount         NUMERIC(14, 2) NOT NULL
        CHECK (amount > 0),

    reference_type VARCHAR(30),
    reference_id   UUID,

    description    VARCHAR(255),

    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallet_transactions_wallet_created
    ON wallet_transactions (wallet_id, created_at DESC);

CREATE UNIQUE INDEX idx_wallet_auction_payment
    ON wallet_transactions (reference_id)
    WHERE type = 'AUCTION_PAYMENT'
        AND reference_type = 'AUCTION';
