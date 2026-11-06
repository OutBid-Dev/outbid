-- =========================================================
-- ENUM TYPES
-- =========================================================

CREATE TYPE auction_status AS ENUM (
    'DRAFT',
    'SCHEDULED',
    'ACTIVE',
    'ENDED',
    'CANCELLED'
    );

CREATE TYPE auction_item_condition AS ENUM (
    'NEW',
    'LIKE_NEW',
    'USED_GOOD',
    'USED_FAIR',
    'FOR_PARTS'
    );

-- =========================================================
-- AUCTION CATEGORIES
-- =========================================================

CREATE TABLE auction_categories
(
    id          UUID PRIMARY KEY      DEFAULT gen_random_uuid(),

    name        VARCHAR(150) NOT NULL,
    slug        VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,

    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_auction_categories_name UNIQUE (name)
);

-- =========================================================
-- AUCTIONS
-- =========================================================

CREATE TABLE auctions
(
    id                    UUID PRIMARY KEY                DEFAULT gen_random_uuid(),

    seller_id             UUID                   NOT NULL
        REFERENCES users (id) ON DELETE RESTRICT,

    title                 VARCHAR(150)           NOT NULL,
    description           TEXT,

    item_condition        auction_item_condition NOT NULL DEFAULT 'NEW',
    brand                 VARCHAR(100),
    model                 VARCHAR(100),
    specifications        JSONB,
    location              VARCHAR(255),

    starting_price        NUMERIC(12, 2)         NOT NULL,
    current_price         NUMERIC(12, 2),
    minimum_bid_increment NUMERIC(12, 2)         NOT NULL,

    start_time            TIMESTAMPTZ,
    end_time              TIMESTAMPTZ,

    status                auction_status         NOT NULL DEFAULT 'DRAFT',

    created_at            TIMESTAMPTZ            NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ            NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_auction_starting_price
        CHECK (starting_price > 0),

    CONSTRAINT chk_auction_current_price
        CHECK (current_price >= starting_price),

    CONSTRAINT chk_auction_minimum_bid_increment
        CHECK (minimum_bid_increment > 0),

    CONSTRAINT chk_auction_time_range
        CHECK (
            start_time IS NULL
                OR end_time IS NULL
                OR end_time > start_time
            )
);

-- =========================================================
-- 3. AUCTION IMAGES
-- =========================================================

CREATE TABLE auction_images
(
    id            UUID PRIMARY KEY     DEFAULT gen_random_uuid(),

    auction_id    UUID        NOT NULL
        REFERENCES auctions (id) ON DELETE CASCADE,

    image_url     TEXT        NOT NULL,
    display_order SMALLINT    NOT NULL,

    is_primary    BOOLEAN     NOT NULL DEFAULT FALSE,

    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_auction_image_display_order
        CHECK (display_order >= 1),

    CONSTRAINT uq_auction_image_order
        UNIQUE (auction_id, display_order)
);

CREATE UNIQUE INDEX uq_auction_primary_image
    ON auction_images (auction_id)
    WHERE is_primary = TRUE;

-- =========================================================
-- AUCTION-CATEGORY ASSIGNMENTS
-- =========================================================

CREATE TABLE auction_category_assignments
(
    auction_id  UUID NOT NULL
        REFERENCES auctions (id) ON DELETE CASCADE,

    category_id UUID NOT NULL
        REFERENCES auction_categories (id) ON DELETE RESTRICT,

    PRIMARY KEY (auction_id, category_id)
);

CREATE INDEX idx_auction_category_assignments_category_id
    ON auction_category_assignments (category_id);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_auctions_seller_id
    ON auctions (seller_id);

CREATE INDEX idx_auctions_status_start_time
    ON auctions (status, start_time);

CREATE INDEX idx_auctions_status_end_time
    ON auctions (status, end_time);

CREATE INDEX idx_auctions_created_at
    ON auctions (created_at DESC);

CREATE INDEX idx_auction_images_auction_id
    ON auction_images (auction_id);