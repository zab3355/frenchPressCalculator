package com.frenchpress.api.preferences;

import com.frenchpress.api.event.DrinkType;
import com.frenchpress.api.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PreferencesServiceTest {

    @Mock
    private UserPreferencesRepository userPreferencesRepository;

    @Test
    void getReturnsDefaultsWhenNoPreferencesSaved() {
        User user = new User("google", "sub-1", "a@example.com", "Ada");
        when(userPreferencesRepository.findByUserId(any())).thenReturn(Optional.empty());

        var service = new PreferencesService(userPreferencesRepository);
        var response = service.get(user);

        assertThat(response.defaultDrinkType()).isEqualTo(DrinkType.FRENCH_PRESS);
        assertThat(response.units()).isEqualTo(Units.METRIC);
        verify(userPreferencesRepository, never()).save(any());
    }

    @Test
    void getReturnsSavedPreferencesWhenTheyExist() {
        User user = new User("google", "sub-1", "a@example.com", "Ada");
        var saved = new UserPreferences(user, DrinkType.ESPRESSO, Units.IMPERIAL);
        when(userPreferencesRepository.findByUserId(any())).thenReturn(Optional.of(saved));

        var service = new PreferencesService(userPreferencesRepository);
        var response = service.get(user);

        assertThat(response.defaultDrinkType()).isEqualTo(DrinkType.ESPRESSO);
        assertThat(response.units()).isEqualTo(Units.IMPERIAL);
    }

    @Test
    void updateCreatesNewPreferencesWhenNoneExist() {
        User user = new User("google", "sub-1", "a@example.com", "Ada");
        when(userPreferencesRepository.findByUserId(any())).thenReturn(Optional.empty());
        when(userPreferencesRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var service = new PreferencesService(userPreferencesRepository);
        var response = service.update(user, new UpdatePreferencesRequest(DrinkType.MATCHA, null));

        assertThat(response.defaultDrinkType()).isEqualTo(DrinkType.MATCHA);
        assertThat(response.units()).isEqualTo(Units.METRIC);
        verify(userPreferencesRepository).save(any());
    }

    @Test
    void updatePatchesOnlyProvidedFieldsOnExistingPreferences() {
        User user = new User("google", "sub-1", "a@example.com", "Ada");
        var existing = new UserPreferences(user, DrinkType.FRENCH_PRESS, Units.METRIC);
        when(userPreferencesRepository.findByUserId(any())).thenReturn(Optional.of(existing));
        when(userPreferencesRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var service = new PreferencesService(userPreferencesRepository);
        var response = service.update(user, new UpdatePreferencesRequest(null, Units.IMPERIAL));

        assertThat(response.defaultDrinkType()).isEqualTo(DrinkType.FRENCH_PRESS);
        assertThat(response.units()).isEqualTo(Units.IMPERIAL);
    }
}
