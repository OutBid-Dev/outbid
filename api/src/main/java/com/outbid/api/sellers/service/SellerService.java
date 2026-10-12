package com.outbid.api.sellers.service;

import com.outbid.api.sellers.dto.request.SellerApplicationRequest;
import com.outbid.api.sellers.dto.response.SellerApplicationResponse;
import com.outbid.api.sellers.dto.response.SellerApplicationSummaryResponse;
import java.util.List;
import java.util.UUID;

public interface SellerService {
    SellerApplicationResponse apply(UUID userId, SellerApplicationRequest request);

    List<SellerApplicationSummaryResponse> getApplications(UUID userId);

    SellerApplicationResponse getApplication(UUID userId, UUID applicationId);
}
