package com.frenchpress.api.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByOidcProviderAndOidcSubject(String oidcProvider, String oidcSubject);
}
