package com.frenchpress.api.auth;

public record CurrentUserResponse(Long id, String email, String displayName) {
}
