package com.frenchpress.api.config;

import com.frenchpress.api.AbstractIntegrationTest;
import com.frenchpress.api.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles({"test", "dev"})
class FlywayDevSeedConfigTest extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void seedsDevUsersWhenDevProfileActive() {
        var seeded = userRepository.findByOidcProviderAndOidcSubject("google", "dev-subject-1");

        assertThat(seeded).isPresent();
        assertThat(seeded.get().getEmail()).isEqualTo("ada@example.com");
    }
}
