package com.outbid.api.auctions.dto.request;

import com.outbid.api.auctions.model.AuctionItemCondition;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public record CreateAuctionRequest(
        @NotBlank(message = "Title is required")
                @Size(max = 150, message = "Title cannot exceed 150 characters")
                String title,
        @NotBlank(message = "Description is required")
                @Size(max = 5000, message = "Description cannot exceed 5000 characters")
                String description,
        @NotNull(message = "Item condition is required") AuctionItemCondition itemCondition,
        @Size(max = 100, message = "Brand cannot exceed 100 characters") String brand,
        @Size(max = 100, message = "Model cannot exceed 100 characters") String model,
        Map<String, Object> specifications,
        @Size(max = 255, message = "Location cannot exceed 255 characters") String location,
        @NotNull(message = "Starting price is required")
                @DecimalMin(value = "0.01", message = "Starting price must be greater than zero")
                BigDecimal startingPrice,
        @NotNull(message = "Minimum bid increment is required")
                @DecimalMin(
                        value = "0.01",
                        message = "Minimum bid increment must be greater than zero")
                BigDecimal minimumBidIncrement,
        @NotNull(message = "Start time is required") Instant startTime,
        @NotNull(message = "End time is required") Instant endTime,
        @NotEmpty(message = "At least one category is required") Set<UUID> categoryIds) {}
