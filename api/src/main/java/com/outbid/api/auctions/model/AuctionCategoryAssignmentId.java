package com.outbid.api.auctions.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class AuctionCategoryAssignmentId implements Serializable {

    private UUID auctionId;
    private UUID categoryId;

    public AuctionCategoryAssignmentId() {}

    public AuctionCategoryAssignmentId(UUID auctionId, UUID categoryId) {
        this.auctionId = auctionId;
        this.categoryId = categoryId;
    }

    public UUID getAuctionId() {
        return auctionId;
    }

    public void setAuctionId(UUID auctionId) {
        this.auctionId = auctionId;
    }

    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }

        if (!(object instanceof AuctionCategoryAssignmentId that)) {
            return false;
        }

        return Objects.equals(auctionId, that.auctionId)
                && Objects.equals(categoryId, that.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(auctionId, categoryId);
    }
}
