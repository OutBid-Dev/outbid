CREATE TYPE user_role AS ENUM (
    'BUYER',
    'SELLER',
    'MODERATOR',
    'ADMIN'
);

ALTER TABLE users
    ADD COLUMN role user_role NOT NULL DEFAULT 'BUYER';