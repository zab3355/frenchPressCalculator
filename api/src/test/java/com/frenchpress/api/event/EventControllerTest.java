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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
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

    @Test
    void returnsRecentEventsForAuthenticatedUser() throws Exception {
        User user = userRepository.save(new User("google", "sub-1", "a@example.com", "Ada"));
        drinkEventRepository.save(new DrinkEvent(user, DrinkType.ESPRESSO, EventType.VIEW));

        mockMvc.perform(get("/api/events/recent")
                .with(OAuth2TestSupport.googleUser("sub-1")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].drinkType").value("espresso"))
            .andExpect(jsonPath("$[0].eventType").value("VIEW"))
            .andExpect(jsonPath("$[0].createdAt").exists());
    }

    @Test
    void rejectsUnauthenticatedRecentEventsRequest() throws Exception {
        mockMvc.perform(get("/api/events/recent"))
            .andExpect(status().is3xxRedirection());
    }

    @Test
    void returnsSummaryCountsForAuthenticatedUser() throws Exception {
        User user = userRepository.save(new User("google", "sub-1", "a@example.com", "Ada"));
        drinkEventRepository.save(new DrinkEvent(user, DrinkType.MATCHA, EventType.CALCULATE));
        drinkEventRepository.save(new DrinkEvent(user, DrinkType.MATCHA, EventType.CALCULATE));
        drinkEventRepository.save(new DrinkEvent(user, DrinkType.MATCHA, EventType.VIEW));

        mockMvc.perform(get("/api/events/summary")
                .with(OAuth2TestSupport.googleUser("sub-1")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].drinkType").value("matcha"))
            .andExpect(jsonPath("$[0].count").value(2));
    }

    @Test
    void rejectsUnauthenticatedSummaryRequest() throws Exception {
        mockMvc.perform(get("/api/events/summary"))
            .andExpect(status().is3xxRedirection());
    }
}