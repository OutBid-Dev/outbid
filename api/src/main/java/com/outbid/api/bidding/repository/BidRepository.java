package com.outbid.api.bidding.repository;

import com.outbid.api.bidding.model.Bid;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BidRepository extends JpaRepository<Bid, UUID> {

    Page<Bid> findByAuctionIdOrderByCreatedAtDesc(UUID auctionId, Pageable pageable);

    Page<Bid> findByBidderIdOrderByCreatedAtDesc(UUID bidderId, Pageable pageable);

    Optional<Bid> findFirstByAuctionIdOrderByAmountDescCreatedAtAsc(UUID auctionId);

    List<Bid> findByAuctionIdOrderByCreatedAtAsc(UUID auctionId);

    long countByAuctionId(UUID auctionId);

    boolean existsByAuctionIdAndBidderId(UUID auctionId, UUID bidderId);
}
