package com.outbid.api.auctions.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "auction_category_assignments")
@Getter
@Setter
@NoArgsConstructor
public class AuctionCategoryAssignment {
    @EmbeddedId private AuctionCategoryAssignmentId id = new AuctionCategoryAssignmentId();

    @MapsId("auctionId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @MapsId("categoryId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private AuctionCategory category;

    public AuctionCategoryAssignment(Auction auction, AuctionCategory category) {
        this.auction = auction;
        this.category = category;
        this.id = new AuctionCategoryAssignmentId(auction.getId(), category.getId());
    }
}
