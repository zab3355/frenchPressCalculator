package com.frenchpress.api.user;

import com.frenchpress.api.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

class UserRepositoryTest extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void savesAndFindsByProviderAndSubject() {
        userRepository.save(new User("google", "subject-1", "a@example.com", "Ada"));

        var found = userRepository.findByOidcProviderAndOidcSubject("google", "subject-1");

        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("a@example.com");
    }

    @Test
    void returnsEmptyWhenNoMatch() {
        var found = userRepository.findByOidcProviderAndOidcSubject("google", "missing");

        assertThat(found).isEmpty();
    }
}
