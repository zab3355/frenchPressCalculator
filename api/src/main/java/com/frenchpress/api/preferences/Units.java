package com.frenchpress.api.preferences;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Units {
    METRIC("metric"),
    IMPERIAL("imperial");

    private final String wireValue;

    Units(String wireValue) {
        this.wireValue = wireValue;
    }

    @JsonValue
    public String getWireValue() {
        return wireValue;
    }

    @JsonCreator
    public static Units fromWireValue(String value) {
        for (Units unit : values()) {
            if (unit.wireValue.equals(value)) {
                return unit;
            }
        }
        throw new IllegalArgumentException("Unknown units: " + value);
    }
}
