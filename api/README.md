# French Press Calculator API

Spring Boot service providing Google OAuth login, per-user drink-event
tracking, dashboard aggregation, and saved preferences for the French
Press Calculator.

## Running locally

Requires Docker.

1. Copy `.env.example` (repo root) to `.env` and fill in `GOOGLE_CLIENT_ID`
   / `GOOGLE_CLIENT_SECRET` (see "Google OAuth credentials" below).
2. From the repo root: `docker-compose up db api`
3. The API is available at `http://localhost:4202/api/*`, and OpenAPI UI
   (dev profile only) at `http://localhost:4202/swagger-ui.html`.

## Running tests

```bash
cd api
mvn verify
```

Tests use Testcontainers and require Docker to be running locally / in CI.

## Migrations and seed data

Schema is managed by Flyway (`src/main/resources/db/migration`). A second
migration location, `src/main/resources/db/seed`, is added only under the
`dev` Spring profile (`SPRING_PROFILES_ACTIVE=dev`) and inserts a couple
of fake users with a spread of drink events, so the dashboard has
something to show when demoing locally. It is never applied in `prod`.

## Google OAuth credentials (dev)

1. https://console.cloud.google.com/apis/credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Authorized redirect URI: `http://localhost:4202/login/oauth2/code/google`
4. Put the client ID/secret in `.env` as `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`

## API docs

`GET /swagger-ui.html` (dev profile only) — interactive OpenAPI UI for
every endpoint documented in this service.
