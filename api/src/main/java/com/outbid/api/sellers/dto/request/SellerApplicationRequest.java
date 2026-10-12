package com.outbid.api.sellers.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SellerApplicationRequest(
        @NotBlank(message = "Application reason is required")
                @Size(max = 1000, message = "Reason must not exceed 1000 characters")
                String reason) {}
