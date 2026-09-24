package com.frenchpress.api.auth;

import com.frenchpress.api.user.User;
import com.frenchpress.api.user.UserRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

/**
 * Maps the authenticated OAuth2User principal to the local User row.
 * Hardcodes provider "google" since it's the only registered
 * ClientRegistration at launch; adding a second provider means reading
 * the registrationId off the principal instead.
 */
@Component
public class CurrentUserResolver {

    private final UserRepository userRepository;

    public CurrentUserResolver(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User resolve(OAuth2User principal) {
        return userRepository.findByOidcProviderAndOidcSubject("google", principal.getName())
            .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + principal.getName()));
    }
}
