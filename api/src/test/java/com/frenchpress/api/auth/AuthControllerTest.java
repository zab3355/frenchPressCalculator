package com.frenchpress.api.auth;

import com.frenchpress.api.AbstractIntegrationTest;
import com.frenchpress.api.OAuth2TestSupport;
import com.frenchpress.api.user.User;
import com.frenchpress.api.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Transactional
class AuthControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Test
    void meReturns401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/me"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void meReturnsCurrentUserWhenAuthenticated() throws Exception {
        userRepository.save(new User("google", "sub-1", "a@example.com", "Ada"));

        mockMvc.perform(get("/api/me").with(OAuth2TestSupport.googleUser("sub-1")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("a@example.com"));
    }

    @Test
    void logoutInvalidatesSession() throws Exception {
        userRepository.save(new User("google", "sub-1", "a@example.com", "Ada"));

        mockMvc.perform(post("/api/auth/logout").with(OAuth2TestSupport.googleUser("sub-1")).with(csrfHeader()))
            .andExpect(status().isNoContent());
    }

    private static org.springframework.test.web.servlet.request.RequestPostProcessor csrfHeader() {
        return org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf();
    }
}
