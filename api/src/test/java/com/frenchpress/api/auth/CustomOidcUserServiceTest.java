package com.frenchpress.api.auth;

import com.frenchpress.api.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomOidcUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Test
    void upsertLogic_createsNewUserWhenNoneExists() {
        when(userRepository.findByOidcProviderAndOidcSubject("google", "sub-1")).thenReturn(java.util.Optional.empty());
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var service = new CustomOidcUserService(userRepository);
        var saved = service.upsertUser("google", "sub-1", "a@example.com", "Ada");

        assertThat(saved.getOidcSubject()).isEqualTo("sub-1");
        verify(userRepository).save(any());
    }

    @Test
    void upsertLogic_updatesEmailAndNameWhenUserExists() {
        var existing = new com.frenchpress.api.user.User("google", "sub-1", "old@example.com", "Old Name");
        when(userRepository.findByOidcProviderAndOidcSubject("google", "sub-1")).thenReturn(java.util.Optional.of(existing));
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var service = new CustomOidcUserService(userRepository);
        var saved = service.upsertUser("google", "sub-1", "new@example.com", "New Name");

        assertThat(saved.getEmail()).isEqualTo("new@example.com");
        assertThat(saved.getDisplayName()).isEqualTo("New Name");
    }
}
