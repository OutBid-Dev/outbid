package com.outbid.api.bidding.repository;

import com.outbid.api.bidding.model.AuctionEvent;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuctionEventRepository extends JpaRepository<AuctionEvent, UUID> {

    Page<AuctionEvent> findByAuctionIdOrderByCreatedAtDesc(UUID auctionId, Pageable pageable);
}
