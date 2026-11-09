package com.outbid.api.bidding.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "auction_events")
@Getter
@Setter
@NoArgsConstructor
public class AuctionEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "auction_id", nullable = false)
    private UUID auctionId;

    @Column(name = "bid_id")
    private UUID bidId;

    @Column(name = "actor_id")
    private UUID actorId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 40)
    private AuctionEventType eventType;

    @Column(precision = 14, scale = 2)
    private BigDecimal amount;

    @Column(length = 255)
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public AuctionEvent(
            UUID auctionId,
            UUID bidId,
            UUID actorId,
            AuctionEventType eventType,
            BigDecimal amount,
            String description) {
        this.auctionId = auctionId;
        this.bidId = bidId;
        this.actorId = actorId;
        this.eventType = eventType;
        this.amount = amount;
        this.description = description;
    }
}
