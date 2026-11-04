package com.outbid.api.auctions.service;

import com.outbid.api.auctions.dto.request.CreateAuctionRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionCategoriesRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionImagesRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionSpecificationsRequest;
import com.outbid.api.auctions.dto.response.AuctionResponse;
import com.outbid.api.auctions.model.Auction;
import com.outbid.api.auctions.model.AuctionCategory;
import com.outbid.api.auctions.model.AuctionCategoryAssignment;
import com.outbid.api.auctions.model.AuctionImage;
import com.outbid.api.auctions.model.AuctionStatus;
import com.outbid.api.auctions.repository.AuctionCategoryRepository;
import com.outbid.api.auctions.repository.AuctionRepository;
import com.outbid.api.auth.model.User;
import com.outbid.api.auth.repository.UserRepository;
import com.outbid.api.common.exceptions.ForbiddenException;
import com.outbid.api.common.exceptions.ResourceNotFoundException;
import java.math.BigDecimal;
import java.net.URI;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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

    @Override
    @Transactional
    public AuctionResponse updateAuction(
            UUID auctionId, UpdateAuctionRequest request, UUID sellerId) {
        Auction auction = getAuction(auctionId);
        requireOwner(auction, sellerId);

        if (request.title() != null) {
            String title = request.title().trim();

            if (title.isEmpty()) {
                throw new IllegalArgumentException("Auction title cannot be empty");
            }

            auction.setTitle(title);
        }

        if (request.description() != null) {
            String description = request.description().trim();
            auction.setDescription(description.isEmpty() ? null : description);
        }

        if (request.itemCondition() != null) {
            auction.setItemCondition(request.itemCondition());
        }

        if (request.brand() != null) {
            String brand = request.brand().trim();
            auction.setBrand(brand.isEmpty() ? null : brand);
        }

        if (request.model() != null) {
            String model = request.model().trim();
            auction.setModel(model.isEmpty() ? null : model);
        }

        if (request.location() != null) {
            String location = request.location().trim();
            auction.setLocation(location.isEmpty() ? null : location);
        }

        if (request.startingPrice() != null) {
            BigDecimal currentStartingPrice = auction.getStartingPrice();

            boolean hasReceivedBids =
                    auction.getCurrentPrice() != null
                            && auction.getCurrentPrice().compareTo(currentStartingPrice) > 0;

            if (hasReceivedBids) {
                throw new IllegalArgumentException(
                        "Starting price cannot be changed after bids have been placed");
            }

            auction.setStartingPrice(request.startingPrice());
            auction.setCurrentPrice(request.startingPrice());
        }

        if (request.minimumBidIncrement() != null) {
            auction.setMinimumBidIncrement(request.minimumBidIncrement());
        }

        if (request.startTime() != null) {
            if (!request.startTime().isAfter(Instant.now())) {
                throw new IllegalArgumentException("Auction start time must be in the future");
            }

            auction.setStartTime(request.startTime());
        }

        if (request.endTime() != null) {
            auction.setEndTime(request.endTime());
        }

        if (auction.getStartTime() != null
                && auction.getEndTime() != null
                && !auction.getEndTime().isAfter(auction.getStartTime())) {

            throw new IllegalArgumentException("Auction end time must be after start time");
        }

        Auction updatedAuction = auctionRepository.saveAndFlush(auction);

        return AuctionResponse.from(updatedAuction);
    }

    @Override
    @Transactional
    public AuctionResponse updateAuctionCategories(
            UUID auctionId, UpdateAuctionCategoriesRequest request, UUID sellerId) {
        Auction auction = getAuction(auctionId);
        requireOwner(auction, sellerId);

        if (request.operations() == null || request.operations().isEmpty()) {
            throw new IllegalArgumentException("At least one category operation is required");
        }

        for (UpdateAuctionCategoriesRequest.CategoryOperation operation : request.operations()) {

            if (operation == null
                    || operation.operation() == null
                    || operation.categoryId() == null) {
                throw new IllegalArgumentException(
                        "Category operation and category ID are required");
            }

            UUID categoryId = operation.categoryId();

            switch (operation.operation()) {
                case ADD -> {
                    boolean alreadyAssigned =
                            auction.getCategoryAssignments().stream()
                                    .anyMatch(
                                            assignment ->
                                                    assignment
                                                            .getCategory()
                                                            .getId()
                                                            .equals(categoryId));

                    if (alreadyAssigned) {
                        continue;
                    }

                    AuctionCategory category =
                            categoryRepository
                                    .findById(categoryId)
                                    .orElseThrow(
                                            () ->
                                                    new ResourceNotFoundException(
                                                            "Category not found: " + categoryId));

                    AuctionCategoryAssignment assignment =
                            new AuctionCategoryAssignment(auction, category);

                    auction.addCategoryAssignment(assignment);
                }

                case REMOVE -> {
                    AuctionCategoryAssignment assignment =
                            auction.getCategoryAssignments().stream()
                                    .filter(item -> item.getCategory().getId().equals(categoryId))
                                    .findFirst()
                                    .orElseThrow(
                                            () ->
                                                    new ResourceNotFoundException(
                                                            "Category assignment not found: "
                                                                    + categoryId));

                    auction.getCategoryAssignments().remove(assignment);
                }

                default -> throw new IllegalArgumentException("Unsupported category operation");
            }
        }

        return AuctionResponse.from(auctionRepository.saveAndFlush(auction));
    }

    @Override
    @Transactional
    public AuctionResponse updateAuctionSpecifications(
            UUID auctionId, UpdateAuctionSpecificationsRequest request, UUID sellerId) {
        Auction auction = getAuction(auctionId);
        requireOwner(auction, sellerId);

        if (request.operations() == null || request.operations().isEmpty()) {
            throw new IllegalArgumentException("At least one specification operation is required");
        }

        Map<String, Object> specifications =
                auction.getSpecifications() == null
                        ? new java.util.HashMap<>()
                        : new java.util.HashMap<>(auction.getSpecifications());

        for (UpdateAuctionSpecificationsRequest.SpecificationOperation operation :
                request.operations()) {

            if (operation == null || operation.operation() == null) {
                throw new IllegalArgumentException("Specification operation is required");
            }

            final boolean b = operation.key() == null || operation.key().isBlank();
            switch (operation.operation()) {
                case SET -> {
                    if (b) {
                        throw new IllegalArgumentException("Specification key is required");
                    }
                    if (operation.value() == null) {
                        throw new IllegalArgumentException("Specification value cannot be null");
                    }

                    specifications.put(operation.key().trim(), operation.value());
                }

                case REMOVE -> {
                    if (b) {
                        throw new IllegalArgumentException("Specification key is required");
                    }
                    if (!specifications.containsKey(operation.key().trim())) {
                        throw new ResourceNotFoundException(
                                "Specification not found: " + operation.key());
                    }

                    specifications.remove(operation.key().trim());
                }

                case CLEAR -> specifications.clear();

                default ->
                        throw new IllegalArgumentException("Unsupported specification operation");
            }
        }

        auction.setSpecifications(specifications);

        return AuctionResponse.from(auctionRepository.saveAndFlush(auction));
    }

    @Override
    @Transactional
    public AuctionResponse updateAuctionImages(
            UUID auctionId, UpdateAuctionImagesRequest request, UUID sellerId) {

        Auction auction = getAuction(auctionId);
        requireOwner(auction, sellerId);

        if (request.operations() == null || request.operations().isEmpty()) {
            throw new IllegalArgumentException("At least one image operation is required");
        }

        for (UpdateAuctionImagesRequest.ImageOperation operation : request.operations()) {

            if (operation == null || operation.operation() == null) {
                throw new IllegalArgumentException("Image operation is required");
            }

            switch (operation.operation()) {
                case ADD -> {
                    validateImageUrl(operation.imageUrl());

                    AuctionImage image = new AuctionImage();

                    image.setId(UUID.randomUUID());
                    image.setAuction(auction);
                    image.setImageUrl(operation.imageUrl().trim());

                    int nextDisplayOrder =
                            auction.getImages().stream()
                                            .map(AuctionImage::getDisplayOrder)
                                            .filter(Objects::nonNull)
                                            .max(Integer::compareTo)
                                            .orElse(-1)
                                    + 1;
                    image.setDisplayOrder(nextDisplayOrder);

                    boolean hasPrimary =
                            auction.getImages().stream().anyMatch(AuctionImage::isPrimary);

                    image.setPrimary(!hasPrimary);

                    auction.getImages().add(image);
                }

                case REPLACE -> {
                    AuctionImage image = getAuctionImage(auction, operation.imageId());

                    validateImageUrl(operation.imageUrl());

                    image.setImageUrl(operation.imageUrl().trim());
                }

                case REMOVE -> {
                    AuctionImage image = getAuctionImage(auction, operation.imageId());

                    auction.getImages().remove(image);
                }

                case REORDER -> {
                    if (operation.displayOrder() == null || operation.displayOrder() < 0) {
                        throw new IllegalArgumentException("A valid display order is required");
                    }

                    AuctionImage image = getAuctionImage(auction, operation.imageId());

                    image.setDisplayOrder(operation.displayOrder());
                }

                default -> throw new IllegalArgumentException("Unsupported image operation");
            }
        }

        normalizeImageOrder(auction);

        if (!auction.getImages().isEmpty()
                && auction.getImages().stream().noneMatch(AuctionImage::isPrimary)) {
            auction.getImages().getFirst().setPrimary(true);
        }

        return AuctionResponse.from(auctionRepository.saveAndFlush(auction));
    }

    @Override
    @Transactional
    public void deleteAuction(UUID auctionId, UUID requesterId, boolean admin) {
        Auction auction = getAuction(auctionId);

        if (!admin) {
            requireOwner(auction, requesterId);
        }

        auctionRepository.delete(auction);
    }

    private Auction getAuction(UUID auctionId) {
        return auctionRepository
                .findById(auctionId)
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "Auction not found with id: " + auctionId));
    }

    private void requireOwner(Auction auction, UUID sellerId) {
        if (!auction.getSeller().getId().equals(sellerId)) {
            throw new ForbiddenException("You do not have permission to modify this auction");
        }
    }

    private AuctionImage getAuctionImage(Auction auction, UUID imageId) {
        return auction.getImages().stream()
                .filter(image -> image.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Auction image not found"));
    }

    private void validateImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalArgumentException("Image URL is required");
        }

        try {
            URI uri = URI.create(imageUrl.trim());

            String scheme = uri.getScheme();

            if (uri.getHost() == null
                    || scheme == null
                    || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
                throw new IllegalArgumentException("Invalid image URL");
            }
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Invalid image URL", exception);
        }
    }

    private void normalizeImageOrder(Auction auction) {
        List<AuctionImage> images = new ArrayList<>(auction.getImages());

        images.sort(
                Comparator.comparing(
                        AuctionImage::getDisplayOrder, Comparator.nullsLast(Integer::compareTo)));

        int offset =
                images.stream()
                                .map(AuctionImage::getDisplayOrder)
                                .filter(Objects::nonNull)
                                .max(Integer::compareTo)
                                .orElse(0)
                        + images.size()
                        + 1;

        for (int i = 0; i < images.size(); i++) {
            images.get(i).setDisplayOrder(offset + i);
        }

        auctionRepository.flush();

        for (int i = 0; i < images.size(); i++) {
            images.get(i).setDisplayOrder(i);
        }
    }
}
