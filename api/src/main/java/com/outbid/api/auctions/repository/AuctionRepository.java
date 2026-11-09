package com.outbid.api.auctions.repository;

import com.outbid.api.auctions.model.Auction;
import com.outbid.api.auctions.model.AuctionStatus;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuctionRepository
        extends JpaRepository<Auction, UUID>, JpaSpecificationExecutor<Auction> {
    List<Auction> findAllByStatusOrderByCreatedAtDesc(AuctionStatus status);

    @Query(
            """
            SELECT a
            FROM Auction a
            WHERE a.seller.id = :sellerId
            ORDER BY a.createdAt DESC
            """)
    List<Auction> findAllBySellerIdOrderByCreatedAtDesc(@Param("sellerId") UUID sellerId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Auction a WHERE a.id = :auctionId")
    Optional<Auction> findByIdForUpdate(@Param("auctionId") UUID auctionId);
}
