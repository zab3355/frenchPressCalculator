package com.frenchpress.api.preferences;

import com.frenchpress.api.AbstractIntegrationTest;
import com.frenchpress.api.OAuth2TestSupport;
import com.frenchpress.api.user.User;
import com.frenchpress.api.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class PreferencesControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Test
    void getReturnsDefaultsWhenNoPreferencesSaved() throws Exception {
        userRepository.save(new User("google", "prefs-sub-1", "a@example.com", "Ada"));

        mockMvc.perform(get("/api/preferences").with(OAuth2TestSupport.googleUser("prefs-sub-1")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.defaultDrinkType").value("french-press"))
            .andExpect(jsonPath("$.units").value("metric"));
    }

    @Test
    void getRejectsUnauthenticatedRequest() throws Exception {
        mockMvc.perform(get("/api/preferences"))
            .andExpect(status().is3xxRedirection());
    }

    @Test
    void patchUpdatesAndPersistsPreferences() throws Exception {
        userRepository.save(new User("google", "prefs-sub-2", "b@example.com", "Grace"));

        mockMvc.perform(patch("/api/preferences")
                .with(OAuth2TestSupport.googleUser("prefs-sub-2"))
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(APPLICATION_JSON)
                .content("{\"units\":\"imperial\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.defaultDrinkType").value("french-press"))
            .andExpect(jsonPath("$.units").value("imperial"));

        mockMvc.perform(get("/api/preferences").with(OAuth2TestSupport.googleUser("prefs-sub-2")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.units").value("imperial"));
    }

    @Test
    void patchRejectsUnauthenticatedRequest() throws Exception {
        mockMvc.perform(patch("/api/preferences")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(APPLICATION_JSON)
                .content("{\"units\":\"imperial\"}"))
            .andExpect(status().is3xxRedirection());
    }
}
