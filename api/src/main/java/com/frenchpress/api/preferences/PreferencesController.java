package com.frenchpress.api.preferences;

import com.frenchpress.api.auth.CurrentUserResolver;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/preferences")
public class PreferencesController {

    private final PreferencesService preferencesService;
    private final CurrentUserResolver currentUserResolver;

    public PreferencesController(PreferencesService preferencesService, CurrentUserResolver currentUserResolver) {
        this.preferencesService = preferencesService;
        this.currentUserResolver = currentUserResolver;
    }

    @GetMapping
    public PreferencesResponse get(@AuthenticationPrincipal OAuth2User principal) {
        var user = currentUserResolver.resolve(principal);
        return preferencesService.get(user);
    }

    @PatchMapping
    public PreferencesResponse update(@AuthenticationPrincipal OAuth2User principal,
                                       @RequestBody UpdatePreferencesRequest request) {
        var user = currentUserResolver.resolve(principal);
        return preferencesService.update(user, request);
    }
}
