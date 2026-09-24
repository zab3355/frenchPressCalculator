package com.frenchpress.api.preferences;

import com.frenchpress.api.AbstractIntegrationTest;
import com.frenchpress.api.event.DrinkType;
import com.frenchpress.api.user.User;
import com.frenchpress.api.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

class UserPreferencesRepositoryTest extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPreferencesRepository userPreferencesRepository;

    @Test
    void savesAndFindsByUserId() {
        User user = userRepository.save(new User("google", "prefs-repo-subject-1", "a@example.com", "Ada"));
        userPreferencesRepository.save(new UserPreferences(user, DrinkType.ESPRESSO, Units.IMPERIAL));

        var found = userPreferencesRepository.findByUserId(user.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getDefaultDrinkType()).isEqualTo(DrinkType.ESPRESSO);
        assertThat(found.get().getUnits()).isEqualTo(Units.IMPERIAL);
    }

    @Test
    void returnsEmptyWhenNoPreferencesSaved() {
        var found = userPreferencesRepository.findByUserId(999L);

        assertThat(found).isEmpty();
    }
}
