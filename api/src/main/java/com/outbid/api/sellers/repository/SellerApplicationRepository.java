package com.outbid.api.sellers.repository;

import com.outbid.api.sellers.model.SellerApplication;
import com.outbid.api.sellers.model.SellerApplicationStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerApplicationRepository extends JpaRepository<SellerApplication, UUID> {
    boolean existsByUserIdAndStatusIn(UUID userId, List<SellerApplicationStatus> statuses);

    List<SellerApplication> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<SellerApplication> findByIdAndUserId(UUID id, UUID userId);

    List<SellerApplication> findAllByOrderByCreatedAtDesc();
}
