package com.outbid.api.bidding.service;

import com.outbid.api.auctions.model.Auction;
import com.outbid.api.auctions.model.AuctionStatus;
import com.outbid.api.auctions.repository.AuctionRepository;
import com.outbid.api.bidding.dto.response.AuctionEventResponse;
import com.outbid.api.bidding.dto.response.AuctionTimelineResponse;
import com.outbid.api.bidding.dto.response.BidResponse;
import com.outbid.api.bidding.dto.response.BiddingStateResponse;
import com.outbid.api.bidding.model.AuctionEvent;
import com.outbid.api.bidding.model.AuctionEventType;
import com.outbid.api.bidding.model.Bid;
import com.outbid.api.bidding.repository.AuctionEventRepository;
import com.outbid.api.bidding.repository.BidRepository;
import com.outbid.api.wallet.model.Wallet;
import com.outbid.api.wallet.repository.WalletRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BidServiceImpl implements BidService {

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final AuctionEventRepository auctionEventRepository;
    private final WalletRepository walletRepository;

    public BidServiceImpl(
            AuctionRepository auctionRepository,
            BidRepository bidRepository,
            AuctionEventRepository auctionEventRepository,
            WalletRepository walletRepository) {
        this.auctionRepository = auctionRepository;
        this.bidRepository = bidRepository;
        this.auctionEventRepository = auctionEventRepository;
        this.walletRepository = walletRepository;
    }

    @Override
    @Transactional
    public BidResponse placeBid(UUID auctionId, UUID bidderId, BigDecimal amount) {
        Auction auction =
                auctionRepository
                        .findByIdForUpdate(auctionId)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Auction not found"));

        Instant now = Instant.now();

        validateAuction(auction, now);

        Wallet wallet =
                walletRepository
                        .findByUserIdForUpdate(bidderId)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Wallet not found"));

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Insufficient wallet balance");
        }

        Bid previousHighestBid =
                bidRepository
                        .findFirstByAuctionIdOrderByAmountDescCreatedAtAsc(auctionId)
                        .orElse(null);

        BigDecimal minimumNextBid =
                previousHighestBid == null
                        ? auction.getStartingPrice()
                        : auction.getCurrentPrice().add(auction.getMinimumBidIncrement());

        if (amount.compareTo(minimumNextBid) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Bid must be at least " + minimumNextBid);
        }

        boolean hasBidBefore = bidRepository.existsByAuctionIdAndBidderId(auctionId, bidderId);

        Bid bid = new Bid(auctionId, bidderId, amount);
        bid = bidRepository.save(bid);

        auction.setCurrentPrice(amount);

        AuctionEventType eventType =
                hasBidBefore ? AuctionEventType.BID_INCREASED : AuctionEventType.BID_PLACED;

        auctionEventRepository.save(
                new AuctionEvent(
                        auctionId,
                        bid.getId(),
                        bidderId,
                        eventType,
                        amount,
                        hasBidBefore ? "Bid increased" : "New bid placed"));

        if (previousHighestBid != null && !previousHighestBid.getBidderId().equals(bidderId)) {

            auctionEventRepository.save(
                    new AuctionEvent(
                            auctionId,
                            bid.getId(),
                            previousHighestBid.getBidderId(),
                            AuctionEventType.OUTBID,
                            amount,
                            "Bidder was outbid"));
        }

        return BidResponse.from(bid);
    }

    @Override
    @Transactional(readOnly = true)
    public BiddingStateResponse getBiddingState(UUID auctionId) {
        Auction auction =
                auctionRepository
                        .findById(auctionId)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Auction not found"));

        long totalBids = bidRepository.countByAuctionId(auctionId);

        BigDecimal currentPrice =
                auction.getCurrentPrice() != null
                        ? auction.getCurrentPrice()
                        : auction.getStartingPrice();

        BigDecimal minimumNextBid =
                totalBids == 0
                        ? auction.getStartingPrice()
                        : currentPrice.add(auction.getMinimumBidIncrement());

        return new BiddingStateResponse(
                auctionId,
                currentPrice,
                auction.getMinimumBidIncrement(),
                minimumNextBid,
                totalBids);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BidResponse> getBidHistory(UUID auctionId, Pageable pageable) {

        if (!auctionRepository.existsById(auctionId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Auction not found");
        }

        return bidRepository
                .findByAuctionIdOrderByCreatedAtDesc(auctionId, pageable)
                .map(BidResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public AuctionTimelineResponse getAuctionTimeline(UUID auctionId, Pageable pageable) {

        if (!auctionRepository.existsById(auctionId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Auction not found");
        }

        Page<AuctionEvent> eventPage =
                auctionEventRepository.findByAuctionIdOrderByCreatedAtDesc(auctionId, pageable);

        return new AuctionTimelineResponse(
                eventPage.map(AuctionEventResponse::from).getContent(),
                eventPage.getNumber(),
                eventPage.getSize(),
                eventPage.getTotalElements(),
                eventPage.getTotalPages(),
                eventPage.isLast());
    }

    private void validateAuction(Auction auction, Instant now) {
        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Auction is not active");
        }

        if (auction.getStartTime() != null && now.isBefore(auction.getStartTime())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Auction has not started yet");
        }

        if (auction.getEndTime() != null && !now.isBefore(auction.getEndTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Auction has ended");
        }
    }
}
