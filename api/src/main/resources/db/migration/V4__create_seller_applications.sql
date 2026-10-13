CREATE TYPE seller_application_status AS ENUM (
    'PROCESSING',
    'IN_PROGRESS',
    'SUCCESSFUL',
    'FAILED'
    );

CREATE TABLE seller_applications
(
    id               UUID PRIMARY KEY                   DEFAULT gen_random_uuid(),

    user_id          UUID                      NOT NULL,
    status           seller_application_status NOT NULL DEFAULT 'PROCESSING',

    reason           TEXT,

    reviewed_by      UUID,
    reviewed_at      TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,

    created_at       TIMESTAMP WITH TIME ZONE  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP WITH TIME ZONE  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_seller_application_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_seller_application_reviewer
        FOREIGN KEY (reviewed_by)
            REFERENCES users (id)
            ON DELETE SET NULL
);

CREATE INDEX idx_seller_applications_user_id
    ON seller_applications (user_id);

CREATE INDEX idx_seller_applications_status
    ON seller_applications (status);

CREATE UNIQUE INDEX uq_active_seller_application
    ON seller_applications (user_id)
    WHERE status IN ('PROCESSING', 'IN_PROGRESS');