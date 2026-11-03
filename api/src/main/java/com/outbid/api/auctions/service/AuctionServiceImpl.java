package com.outbid.api.auctions.service;

import com.outbid.api.auctions.dto.request.CreateAuctionRequest;
import com.outbid.api.auctions.dto.response.AuctionResponse;
import com.outbid.api.auctions.model.Auction;
import com.outbid.api.auctions.model.AuctionCategory;
import com.outbid.api.auctions.model.AuctionCategoryAssignment;
import com.outbid.api.auctions.model.AuctionStatus;
import com.outbid.api.auctions.repository.AuctionCategoryRepository;
import com.outbid.api.auctions.repository.AuctionRepository;
import com.outbid.api.auth.model.User;
import com.outbid.api.auth.repository.UserRepository;
import com.outbid.api.common.exceptions.ResourceNotFoundException;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuctionServiceImpl implements AuctionService {
    private final AuctionRepository auctionRepository;
    private final AuctionCategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public AuctionServiceImpl(
            AuctionRepository auctionRepository,
            AuctionCategoryRepository categoryRepository,
            UserRepository userRepository) {
        this.auctionRepository = auctionRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public AuctionResponse createAuction(CreateAuctionRequest request, UUID sellerId) {

        Instant now = Instant.now();

        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException("Auction end time must be after start time");
        }

        if (!request.startTime().isAfter(now)) {
            throw new IllegalArgumentException("Auction start time must be in the future");
        }

        Set<UUID> categoryIds = request.categoryIds();

        List<AuctionCategory> categories = categoryRepository.findAllById(categoryIds);

        if (categories.size() != categoryIds.size()) {
            throw new IllegalArgumentException("One or more auction categories do not exist");
        }

        User seller =
                userRepository
                        .findById(sellerId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Auction auction = new Auction();

        auction.setSeller(seller);
        auction.setTitle(request.title().trim());
        auction.setDescription(request.description() == null ? null : request.description().trim());
        auction.setItemCondition(request.itemCondition());
        auction.setBrand(request.brand());
        auction.setModel(request.model());
        auction.setSpecifications(request.specifications());
        auction.setLocation(request.location());
        auction.setStartingPrice(request.startingPrice());
        auction.setCurrentPrice(request.startingPrice());
        auction.setMinimumBidIncrement(request.minimumBidIncrement());
        auction.setStartTime(request.startTime());
        auction.setEndTime(request.endTime());
        auction.setStatus(AuctionStatus.SCHEDULED);

        for (AuctionCategory category : categories) {
            AuctionCategoryAssignment assignment = new AuctionCategoryAssignment();
            assignment.setCategory(category);
            auction.addCategoryAssignment(assignment);
            assignment.setAuction(auction);
        }

        Auction savedAuction = auctionRepository.saveAndFlush(auction);

        return AuctionResponse.from(savedAuction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuctionResponse> getAllAuctions() {

        return auctionRepository.findAll().stream().map(AuctionResponse::from).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuctionResponse> getPublicAuctions() {

        return auctionRepository.findAllByStatusOrderByCreatedAtDesc(AuctionStatus.ACTIVE).stream()
                .map(AuctionResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuctionResponse> getMyAuctions(UUID authenticatedSellerId) {

        return auctionRepository
                .findAllBySellerIdOrderByCreatedAtDesc(authenticatedSellerId)
                .stream()
                .map(AuctionResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuctionResponse> getAuctionsBySeller(UUID sellerId) {

        if (!userRepository.existsById(sellerId)) {
            throw new ResourceNotFoundException("Seller not found with id: " + sellerId);
        }

        return auctionRepository.findAllBySellerIdOrderByCreatedAtDesc(sellerId).stream()
                .map(AuctionResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AuctionResponse getVisibleAuctionById(UUID id, UUID viewerId, boolean admin) {

        Auction auction =
                auctionRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Auction not found with id: " + id));

        boolean isOwner = auction.getSeller().getId().equals(viewerId);

        boolean isPublic = auction.getStatus() == AuctionStatus.ACTIVE;

        if (!isPublic && !isOwner && !admin) {
            throw new ResourceNotFoundException("Auction not found with id: " + id);
        }

        return AuctionResponse.from(auction);
    }
}
