package com.frenchpress.api.user;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = {"oidc_provider", "oidc_subject"}))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "oidc_provider", nullable = false, length = 32)
    private String oidcProvider;

    @Column(name = "oidc_subject", nullable = false)
    private String oidcSubject;

    @Column(nullable = false)
    private String email;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    protected User() {
    }

    public User(String oidcProvider, String oidcSubject, String email, String displayName) {
        this.oidcProvider = oidcProvider;
        this.oidcSubject = oidcSubject;
        this.email = email;
        this.displayName = displayName;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getOidcProvider() {
        return oidcProvider;
    }

    public String getOidcSubject() {
        return oidcSubject;
    }

    public String getEmail() {
        return email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
