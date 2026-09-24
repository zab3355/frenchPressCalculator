package com.frenchpress.api;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.List;
import java.util.Map;

/** Builds a MockMvc request post-processor that simulates a logged-in Google user. */
public final class OAuth2TestSupport {

    private OAuth2TestSupport() {
    }

    public static RequestPostProcessor googleUser(String subject) {
        Map<String, Object> attributes = Map.of("sub", subject, "email", subject + "@example.com");
        var principal = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority("ROLE_USER")), attributes, "sub");
        var authentication = new OAuth2AuthenticationToken(principal, principal.getAuthorities(), "google");
        return SecurityMockMvcRequestPostProcessors.authentication(authentication);
    }
}
