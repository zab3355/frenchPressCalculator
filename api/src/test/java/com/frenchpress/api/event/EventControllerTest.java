package com.frenchpress.api.event;

import com.frenchpress.api.AbstractIntegrationTest;
import com.frenchpress.api.OAuth2TestSupport;
import com.frenchpress.api.user.User;
import com.frenchpress.api.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Transactional
class EventControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DrinkEventRepository drinkEventRepository;

    @Test
    void recordsEventForAuthenticatedUser() throws Exception {
        User user = userRepository.save(new User("google", "sub-1", "a@example.com", "Ada"));

        mockMvc.perform(post("/api/events")
                .with(OAuth2TestSupport.googleUser("sub-1"))
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(APPLICATION_JSON)
                .content("{\"drinkType\":\"french-press\",\"eventType\":\"VIEW\"}"))
            .andExpect(status().isCreated());

        var events = drinkEventRepository.findTop10ByUserIdOrderByCreatedAtDesc(user.getId());
        assertThat(events).hasSize(1);
        assertThat(events.get(0).getDrinkType()).isEqualTo(DrinkType.FRENCH_PRESS);
    }

    @Test
    void rejectsUnauthenticatedRequest() throws Exception {
        mockMvc.perform(post("/api/events")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(APPLICATION_JSON)
                .content("{\"drinkType\":\"french-press\",\"eventType\":\"VIEW\"}"))
            .andExpect(status().is3xxRedirection());
    }
}