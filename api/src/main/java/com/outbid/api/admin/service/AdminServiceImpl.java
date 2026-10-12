package com.outbid.api.admin.service;

import com.outbid.api.admin.dto.response.AdminSellerApplicationResponse;
import com.outbid.api.auth.model.User;
import com.outbid.api.auth.model.UserRole;
import com.outbid.api.auth.repository.UserRepository;
import com.outbid.api.common.exceptions.ConflictException;
import com.outbid.api.common.exceptions.ForbiddenException;
import com.outbid.api.common.exceptions.ResourceNotFoundException;
import com.outbid.api.sellers.dto.response.SellerApplicationResponse;
import com.outbid.api.sellers.dto.response.SellerApplicationSummaryResponse;
import com.outbid.api.sellers.model.SellerApplication;
import com.outbid.api.sellers.model.SellerApplicationStatus;
import com.outbid.api.sellers.repository.SellerApplicationRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminServiceImpl implements AdminService {
    private final SellerApplicationRepository sellerApplicationRepository;
    private final UserRepository userRepository;

    public AdminServiceImpl(
            SellerApplicationRepository sellerApplicationRepository,
            UserRepository userRepository) {
        this.sellerApplicationRepository = sellerApplicationRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SellerApplicationSummaryResponse> getSellerApplications() {
        return sellerApplicationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(SellerApplicationSummaryResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminSellerApplicationResponse getSellerApplication(UUID applicationId) {
        SellerApplication application = findApplication(applicationId);
        return AdminSellerApplicationResponse.from(application);
    }

    @Override
    @Transactional
    public SellerApplicationResponse approveSellerApplication(UUID adminId, UUID applicationId) {
        User admin = findAdmin(adminId);
        SellerApplication application = findApplication(applicationId);

        ensureReviewable(application);

        User applicant = application.getUser();

        // An applicant must still be a buyer when approved.
        if (applicant.getRole() != UserRole.BUYER) {
            throw new ConflictException("The applicant is no longer eligible to become a seller");
        }

        application.setStatus(SellerApplicationStatus.SUCCESSFUL);
        application.setReviewedBy(admin);
        application.setReviewedAt(Instant.now());

        applicant.setRole(UserRole.SELLER);

        SellerApplication saved = sellerApplicationRepository.save(application);

        return SellerApplicationResponse.from(saved);
    }

    @Override
    @Transactional
    public SellerApplicationResponse rejectSellerApplication(
            UUID adminId, UUID applicationId, String rejectionReason) {
        User admin = findAdmin(adminId);
        SellerApplication application = findApplication(applicationId);

        ensureReviewable(application);

        application.setStatus(SellerApplicationStatus.FAILED);
        application.setReviewedBy(admin);
        application.setReviewedAt(Instant.now());
        application.setRejectionReason(rejectionReason.trim());

        SellerApplication saved = sellerApplicationRepository.save(application);

        return SellerApplicationResponse.from(saved);
    }

    private SellerApplication findApplication(UUID applicationId) {
        return sellerApplicationRepository
                .findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller application not found"));
    }

    private User findAdmin(UUID adminId) {
        User admin =
                userRepository
                        .findById(adminId)
                        .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        if (admin.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Only admins can perform this action");
        }

        return admin;
    }

    private void ensureReviewable(SellerApplication application) {
        SellerApplicationStatus status = application.getStatus();

        if (status != SellerApplicationStatus.PROCESSING
                && status != SellerApplicationStatus.IN_PROGRESS) {
            throw new ConflictException(
                    "This seller application has already been reviewed " + "or cannot be reviewed");
        }
    }
}
