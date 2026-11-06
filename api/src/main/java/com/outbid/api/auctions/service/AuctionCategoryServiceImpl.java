package com.outbid.api.auctions.service;

import com.outbid.api.auctions.dto.request.CreateAuctionCategoryRequest;
import com.outbid.api.auctions.dto.request.UpdateAuctionCategoryRequest;
import com.outbid.api.auctions.dto.response.AuctionCategoryPageResponse;
import com.outbid.api.auctions.dto.response.AuctionCategoryResponse;
import com.outbid.api.auctions.model.AuctionCategory;
import com.outbid.api.auctions.repository.AuctionCategoryRepository;
import com.outbid.api.common.exceptions.ConflictException;
import com.outbid.api.common.exceptions.ResourceNotFoundException;
import java.text.Normalizer;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuctionCategoryServiceImpl implements AuctionCategoryService {
    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9]+");
    private static final Pattern EDGE_HYPHENS = Pattern.compile("(^-+|-+$)");
    private static final int MAX_PAGE_SIZE = 100;
    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("name", "slug", "createdAt", "updatedAt");

    private final AuctionCategoryRepository auctionCategoryRepository;

    public AuctionCategoryServiceImpl(AuctionCategoryRepository auctionCategoryRepository) {
        this.auctionCategoryRepository = auctionCategoryRepository;
    }

    @Override
    @Transactional
    public AuctionCategoryResponse createCategory(CreateAuctionCategoryRequest request) {
        String name = normalizeName(request.name());
        String slug = generateSlug(name);

        if (auctionCategoryRepository.existsByNameIgnoreCase(name)) {
            throw new ConflictException("A category with this name already exists");
        }

        if (auctionCategoryRepository.existsBySlug(slug)) {
            throw new ConflictException("A category with this slug already exists");
        }

        AuctionCategory auctionCategory = new AuctionCategory();
        auctionCategory.setName(name);
        auctionCategory.setSlug(slug);
        auctionCategory.setDescription(request.description());

        AuctionCategory savedCategory = auctionCategoryRepository.saveAndFlush(auctionCategory);

        return AuctionCategoryResponse.from(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public AuctionCategoryPageResponse getCategories(
            int page, int size, String search, String sortBy, String sortDir) {
        if (page < 0) {
            throw new IllegalArgumentException("Page index cannot be negative");
        }

        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("Page size must be between 1 and " + MAX_PAGE_SIZE);
        }

        if (sortBy == null || !ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new IllegalArgumentException(
                    "Invalid sort field. Allowed fields: " + ALLOWED_SORT_FIELDS);
        }

        Sort.Direction direction;

        try {
            direction = Sort.Direction.fromString(sortDir == null ? "asc" : sortDir);
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Sort direction must be 'asc' or 'desc'");
        }

        String normalizedSearch = search == null || search.isBlank() ? null : search.trim();

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<AuctionCategory> categories;

        if (search == null || search.isBlank()) {
            categories = auctionCategoryRepository.findAll(pageable);
        } else {
            categories = auctionCategoryRepository.searchCategories(normalizedSearch, pageable);
        }

        return new AuctionCategoryPageResponse(
                categories.getContent().stream().map(AuctionCategoryResponse::from).toList(),
                categories.getNumber(),
                categories.getSize(),
                categories.getTotalElements(),
                categories.getTotalPages(),
                categories.isFirst(),
                categories.isLast(),
                sortBy,
                direction.name().toLowerCase(),
                normalizedSearch);
    }

    public AuctionCategoryResponse getCategoryById(UUID categoryID) {
        AuctionCategory category =
                auctionCategoryRepository
                        .findById(categoryID)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Auction category not found with id: "
                                                        + categoryID));

        return AuctionCategoryResponse.from(category);
    }

    @Override
    @Transactional
    public AuctionCategoryResponse updateCategory(UUID id, UpdateAuctionCategoryRequest request) {

        AuctionCategory category =
                auctionCategoryRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Auction category not found with id: " + id));

        if (request.name() != null) {
            String name = normalizeName(request.name());

            if (!name.equals(category.getName())) {
                String slug = generateSlug(name);

                if (auctionCategoryRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
                    throw new ConflictException("A category with this name already exists");
                }

                if (auctionCategoryRepository.existsBySlug(slug)
                        && !slug.equals(category.getSlug())) {
                    throw new ConflictException("A category with this slug already exists");
                }

                category.setName(name);
                category.setSlug(slug);
            }
        }

        if (request.description() != null
                && !request.description().equals(category.getDescription())) {
            category.setDescription(request.description());
        }

        AuctionCategory updatedCategory = auctionCategoryRepository.saveAndFlush(category);

        return AuctionCategoryResponse.from(updatedCategory);
    }

    @Transactional
    public void deleteCategory(UUID id) {
        AuctionCategory category =
                auctionCategoryRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Auction category not found with id: " + id));

        auctionCategoryRepository.delete(category);
    }

    private String normalizeName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Category name is required");
        }

        return name.trim();
    }

    private String generateSlug(String name) {
        String normalized =
                Normalizer.normalize(name.toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
                        .replaceAll("\\p{M}", "");

        String slug = NON_ALPHANUMERIC.matcher(normalized).replaceAll("-");

        slug = EDGE_HYPHENS.matcher(slug).replaceAll("");

        if (slug.isBlank()) {
            throw new IllegalArgumentException("Category name must contain letters or numbers");
        }

        if (slug.length() > 100) {
            slug = slug.substring(0, 100);
            slug = EDGE_HYPHENS.matcher(slug).replaceAll("");
        }

        return slug;
    }
}
