package com.frenchpress.api.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final CurrentUserResolver currentUserResolver;

    public AuthController(CurrentUserResolver currentUserResolver) {
        this.currentUserResolver = currentUserResolver;
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> me(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        var user = currentUserResolver.resolve(principal);
        return ResponseEntity.ok(new CurrentUserResponse(user.getId(), user.getEmail(), user.getDisplayName()));
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        return ResponseEntity.noContent().build();
    }
}
