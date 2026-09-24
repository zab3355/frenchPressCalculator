package com.frenchpress.api.event;

import java.time.OffsetDateTime;

public record RecentEventResponse(DrinkType drinkType, EventType eventType, OffsetDateTime createdAt) {
}
