package com.frenchpress.api.config;

import org.springframework.boot.autoconfigure.flyway.FlywayConfigurationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Adds the dev-only seed migration location. Gated by @Profile("dev") so
 * this bean — and therefore the seed data — never exists in prod.
 */
@Configuration
public class FlywayDevSeedConfig {

    @Bean
    @Profile("dev")
    public FlywayConfigurationCustomizer devSeedMigrationLocations() {
        return configuration -> configuration.locations("classpath:db/migration", "classpath:db/seed");
    }
}
