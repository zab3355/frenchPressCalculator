CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    oidc_provider   VARCHAR(32)  NOT NULL,
    oidc_subject    VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    display_name    VARCHAR(255),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    UNIQUE (oidc_provider, oidc_subject)
);

CREATE TABLE drink_events (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    drink_type  VARCHAR(32) NOT NULL,
    event_type  VARCHAR(16) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_drink_events_user_id ON drink_events(user_id);
CREATE INDEX idx_drink_events_user_type ON drink_events(user_id, event_type, drink_type);
