package com.frenchpress.api.preferences;

import com.frenchpress.api.event.DrinkType;
import com.frenchpress.api.user.User;
import org.springframework.stereotype.Service;

@Service
public class PreferencesService {

    private static final DrinkType DEFAULT_DRINK_TYPE = DrinkType.FRENCH_PRESS;
    private static final Units DEFAULT_UNITS = Units.METRIC;

    private final UserPreferencesRepository userPreferencesRepository;

    public PreferencesService(UserPreferencesRepository userPreferencesRepository) {
        this.userPreferencesRepository = userPreferencesRepository;
    }

    public PreferencesResponse get(User user) {
        return userPreferencesRepository.findByUserId(user.getId())
            .map(prefs -> new PreferencesResponse(prefs.getDefaultDrinkType(), prefs.getUnits()))
            .orElseGet(() -> new PreferencesResponse(DEFAULT_DRINK_TYPE, DEFAULT_UNITS));
    }

    public PreferencesResponse update(User user, UpdatePreferencesRequest request) {
        var prefs = userPreferencesRepository.findByUserId(user.getId())
            .orElseGet(() -> new UserPreferences(user, DEFAULT_DRINK_TYPE, DEFAULT_UNITS));

        if (request.defaultDrinkType() != null) {
            prefs.setDefaultDrinkType(request.defaultDrinkType());
        }
        if (request.units() != null) {
            prefs.setUnits(request.units());
        }

        var saved = userPreferencesRepository.save(prefs);
        return new PreferencesResponse(saved.getDefaultDrinkType(), saved.getUnits());
    }
}
