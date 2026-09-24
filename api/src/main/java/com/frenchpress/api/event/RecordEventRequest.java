package com.frenchpress.api.event;

import jakarta.validation.constraints.NotNull;

public record RecordEventRequest(
    @NotNull DrinkType drinkType,
    @NotNull EventType eventType
) {
}
