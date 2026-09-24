package com.frenchpress.api.preferences;

import com.frenchpress.api.event.DrinkType;

public record PreferencesResponse(DrinkType defaultDrinkType, Units units) {
}
