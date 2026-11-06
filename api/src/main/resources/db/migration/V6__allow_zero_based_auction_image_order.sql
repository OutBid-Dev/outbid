ALTER TABLE auction_images
    DROP CONSTRAINT chk_auction_image_display_order;

ALTER TABLE auction_images
    ADD CONSTRAINT chk_auction_image_display_order
        CHECK (display_order >= 0);