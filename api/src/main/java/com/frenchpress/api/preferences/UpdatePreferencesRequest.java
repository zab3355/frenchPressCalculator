package com.frenchpress.api.preferences;

import com.frenchpress.api.event.DrinkType;

public record UpdatePreferencesRequest(DrinkType defaultDrinkType, Units units) {
}
