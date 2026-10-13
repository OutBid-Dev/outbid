CREATE
EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users
(
    id             UUID PRIMARY KEY      DEFAULT gen_random_uuid(),

    first_name     VARCHAR(50)  NOT NULL,
    last_name      VARCHAR(50)  NOT NULL,
    email          VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN      NOT NULL DEFAULT FALSE,
    image          TEXT,

    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);