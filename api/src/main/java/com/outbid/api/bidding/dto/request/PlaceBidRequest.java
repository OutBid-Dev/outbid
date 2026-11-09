package com.outbid.api.bidding.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PlaceBidRequest(
        @NotNull(message = "Bid amount is required")
                @DecimalMin(
                        value = "0.00",
                        inclusive = false,
                        message = "Bid amount must be greater than zero")
                @Digits(
                        integer = 12,
                        fraction = 2,
                        message = "Bid amount can have at most 2 decimal places")
                BigDecimal amount) {}
