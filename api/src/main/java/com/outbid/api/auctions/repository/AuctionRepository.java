package com.outbid.api.auctions.repository;

import com.outbid.api.auctions.model.Auction;
import com.outbid.api.auctions.model.AuctionStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuctionRepository extends JpaRepository<Auction, UUID> {
    List<Auction> findAllByStatusOrderByCreatedAtDesc(AuctionStatus status);

    @Query(
            """
            SELECT a
            FROM Auction a
            WHERE a.seller.id = :sellerId
            ORDER BY a.createdAt DESC
            """)
    List<Auction> findAllBySellerIdOrderByCreatedAtDesc(@Param("sellerId") UUID sellerId);

    @Query(
            """
            SELECT a
            FROM Auction a
            WHERE a.id = :auctionId
            AND a.seller.id = :sellerId
            """)
    Optional<Auction> findByIdAndSellerId(
            @Param("auctionId") UUID auctionId, @Param("sellerId") UUID sellerId);
}
