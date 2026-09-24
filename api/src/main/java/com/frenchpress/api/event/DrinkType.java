package com.frenchpress.api.event;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DrinkType {
    FRENCH_PRESS("french-press"),
    ESPRESSO("espresso"),
    MATCHA("matcha"),
    COCKTAILS("cocktails");

    private final String wireValue;

    DrinkType(String wireValue) {
        this.wireValue = wireValue;
    }

    @JsonValue
    public String getWireValue() {
        return wireValue;
    }

    @JsonCreator
    public static DrinkType fromWireValue(String value) {
        for (DrinkType type : values()) {
            if (type.wireValue.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown drinkType: " + value);
    }
}
