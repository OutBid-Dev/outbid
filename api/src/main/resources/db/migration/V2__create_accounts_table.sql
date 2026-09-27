CREATE TABLE accounts
(
    id                       UUID PRIMARY KEY      DEFAULT gen_random_uuid(),

    user_id                  UUID         NOT NULL,
    account_id               VARCHAR(255) NOT NULL,
    provider_id              VARCHAR(255) NOT NULL,

    refresh_token            TEXT,
    refresh_token_expires_at TIMESTAMPTZ,

    password                 TEXT,

    created_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_accounts_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);

CREATE INDEX idx_accounts_user_id
    ON accounts (user_id);