package com.frenchpress.api.event;

import com.frenchpress.api.user.User;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "drink_events")
public class DrinkEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "drink_type", nullable = false, length = 32)
    private DrinkType drinkType;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 16)
    private EventType eventType;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    protected DrinkEvent() {
    }

    public DrinkEvent(User user, DrinkType drinkType, EventType eventType) {
        this.user = user;
        this.drinkType = drinkType;
        this.eventType = eventType;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public DrinkType getDrinkType() {
        return drinkType;
    }

    public EventType getEventType() {
        return eventType;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}
