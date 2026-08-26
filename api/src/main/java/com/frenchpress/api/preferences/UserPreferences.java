package com.frenchpress.api.preferences;

import com.frenchpress.api.event.DrinkType;
import com.frenchpress.api.user.User;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "user_preferences")
public class UserPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "default_drink_type", nullable = false, length = 32)
    private DrinkType defaultDrinkType;

    @Column(nullable = false, length = 16)
    private Units units;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected UserPreferences() {
    }

    public UserPreferences(User user, DrinkType defaultDrinkType, Units units) {
        this.user = user;
        this.defaultDrinkType = defaultDrinkType;
        this.units = units;
    }

    @PrePersist
    void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public DrinkType getDefaultDrinkType() {
        return defaultDrinkType;
    }

    public Units getUnits() {
        return units;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setDefaultDrinkType(DrinkType defaultDrinkType) {
        this.defaultDrinkType = defaultDrinkType;
    }

    public void setUnits(Units units) {
        this.units = units;
    }
}
