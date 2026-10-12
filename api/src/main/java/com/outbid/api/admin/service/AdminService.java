package com.outbid.api.admin.service;

import com.outbid.api.admin.dto.response.AdminSellerApplicationResponse;
import com.outbid.api.sellers.dto.response.SellerApplicationResponse;
import com.outbid.api.sellers.dto.response.SellerApplicationSummaryResponse;
import java.util.List;
import java.util.UUID;

public interface AdminService {
    List<SellerApplicationSummaryResponse> getSellerApplications();

    AdminSellerApplicationResponse getSellerApplication(UUID applicationId);

    SellerApplicationResponse approveSellerApplication(UUID adminId, UUID applicationId);

    SellerApplicationResponse rejectSellerApplication(
            UUID adminId, UUID applicationId, String rejectionReason);
}
