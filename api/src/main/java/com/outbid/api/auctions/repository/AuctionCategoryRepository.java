package com.outbid.api.auctions.repository;

import com.outbid.api.auctions.model.AuctionCategory;
import java.util.UUID;
import org.aspectj.weaver.Iterators;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuctionCategoryRepository extends JpaRepository<AuctionCategory, UUID> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsBySlug(String slug);

    boolean existsByNameIgnoreCaseAndIdNot(String name, UUID id);

    @Query(
            """
            SELECT c
            FROM AuctionCategory c
            WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(c.slug) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(COALESCE(c.description, '')) LIKE
                  LOWER(CONCAT('%', :search, '%'))
            """)
    Page<AuctionCategory> searchCategories(@Param("search") String search, Pageable pageable);

    Iterators.Filter<Object> findByNameIgnoreCase(String name);
}
