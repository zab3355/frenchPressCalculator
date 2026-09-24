package com.frenchpress.api.config;

import com.frenchpress.api.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.boot.autoconfigure.flyway.FlywayConfigurationCustomizer;
import org.springframework.context.ApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Negative test to verify seed data is NOT configured when dev profile is inactive.
 * This test class extends AbstractIntegrationTest without overriding @ActiveProfiles,
 * so it uses only the base "test" profile (no "dev"), proving the @Profile("dev")
 * gate on FlywayDevSeedConfig is working correctly.
 *
 * This test verifies that the FlywayConfigurationCustomizer bean for dev seed locations
 * is not created when the dev profile is not active, which prevents the seed migration
 * location from being registered with Flyway.
 */
class FlywayDevSeedConfigNegativeTest extends AbstractIntegrationTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    void devSeedMigrationLocationsNotRegisteredWhenDevProfileNotActive() {
        // Verify that the FlywayConfigurationCustomizer bean for dev seed locations
        // is not present in the application context when dev profile is not active
        assertThatThrownBy(() ->
            applicationContext.getBean("devSeedMigrationLocations", FlywayConfigurationCustomizer.class)
        ).isInstanceOf(NoSuchBeanDefinitionException.class);
    }
}
