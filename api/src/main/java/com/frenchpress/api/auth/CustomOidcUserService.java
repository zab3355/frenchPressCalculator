package com.frenchpress.api.auth;

import com.frenchpress.api.user.User;
import com.frenchpress.api.user.UserRepository;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

@Service
public class CustomOidcUserService extends OidcUserService {

    private final UserRepository userRepository;

    public CustomOidcUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);
        String provider = userRequest.getClientRegistration().getRegistrationId();

        upsertUser(provider, oidcUser.getSubject(), oidcUser.getEmail(), oidcUser.getFullName());

        return oidcUser;
    }

    /** Package-visible for testing; also the single seam for the upsert logic. */
    User upsertUser(String provider, String subject, String email, String displayName) {
        return userRepository.findByOidcProviderAndOidcSubject(provider, subject)
            .map(existing -> {
                existing.setEmail(email);
                existing.setDisplayName(displayName);
                return userRepository.save(existing);
            })
            .orElseGet(() -> userRepository.save(new User(provider, subject, email, displayName)));
    }
}
