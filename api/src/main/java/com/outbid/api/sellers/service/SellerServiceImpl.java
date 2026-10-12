package com.outbid.api.sellers.service;

import com.outbid.api.auth.model.User;
import com.outbid.api.auth.model.UserRole;
import com.outbid.api.auth.repository.UserRepository;
import com.outbid.api.common.exceptions.ConflictException;
import com.outbid.api.common.exceptions.ForbiddenException;
import com.outbid.api.common.exceptions.ResourceNotFoundException;
import com.outbid.api.sellers.dto.request.SellerApplicationRequest;
import com.outbid.api.sellers.dto.response.SellerApplicationResponse;
import com.outbid.api.sellers.dto.response.SellerApplicationSummaryResponse;
import com.outbid.api.sellers.model.SellerApplication;
import com.outbid.api.sellers.model.SellerApplicationStatus;
import com.outbid.api.sellers.repository.SellerApplicationRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {
    private final SellerApplicationRepository sellerApplicationRepository;
    private final UserRepository userRepository;

    @Override
    public SellerApplicationResponse apply(UUID userId, SellerApplicationRequest request) {
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == UserRole.SELLER) {
            throw new ConflictException("You are already a seller");
        }

        if (user.getRole() != UserRole.BUYER) {
            throw new ForbiddenException("Only buyers can apply to become sellers");
        }

        List<SellerApplicationStatus> blockingStatuses =
                List.of(
                        SellerApplicationStatus.PROCESSING,
                        SellerApplicationStatus.IN_PROGRESS,
                        SellerApplicationStatus.SUCCESSFUL);

        if (sellerApplicationRepository.existsByUserIdAndStatusIn(userId, blockingStatuses)) {
            throw new ConflictException(
                    "You already have an active or successful seller application");
        }

        Instant now = Instant.now();

        SellerApplication sellerApplication = new SellerApplication();

        sellerApplication.setUser(user);
        sellerApplication.setStatus(SellerApplicationStatus.PROCESSING);
        sellerApplication.setReason(request.reason());
        sellerApplication.setCreatedAt(now);
        sellerApplication.setUpdatedAt(now);

        SellerApplication savedSellerApplication =
                sellerApplicationRepository.save(sellerApplication);

        return SellerApplicationResponse.from(savedSellerApplication);
    }

    @Override
    public List<SellerApplicationSummaryResponse> getApplications(UUID userId) {
        return sellerApplicationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(SellerApplicationSummaryResponse::from)
                .toList();
    }

    @Override
    public SellerApplicationResponse getApplication(UUID userId, UUID applicationId) {
        SellerApplication application =
                sellerApplicationRepository
                        .findByIdAndUserId(applicationId, userId)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Seller application not found"));

        return SellerApplicationResponse.from(application);
    }
}
