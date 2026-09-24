package com.frenchpress.api.event;

import com.frenchpress.api.auth.CurrentUserResolver;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final CurrentUserResolver currentUserResolver;

    public EventController(EventService eventService, CurrentUserResolver currentUserResolver) {
        this.eventService = eventService;
        this.currentUserResolver = currentUserResolver;
    }

    @PostMapping
    public ResponseEntity<Void> recordEvent(@AuthenticationPrincipal OAuth2User principal,
                                             @Valid @RequestBody RecordEventRequest request) {
        var user = currentUserResolver.resolve(principal);
        eventService.recordEvent(user, request.drinkType(), request.eventType());
        return ResponseEntity.status(201).build();
    }

    @GetMapping("/recent")
    public List<RecentEventResponse> recent(@AuthenticationPrincipal OAuth2User principal) {
        var user = currentUserResolver.resolve(principal);
        return eventService.recentEvents(user).stream()
            .map(e -> new RecentEventResponse(e.getDrinkType(), e.getEventType(), e.getCreatedAt()))
            .toList();
    }

    @GetMapping("/summary")
    public List<DrinkTypeCountResponse> summary(@AuthenticationPrincipal OAuth2User principal) {
        var user = currentUserResolver.resolve(principal);
        return eventService.calculateSummary(user).stream()
            .map(c -> new DrinkTypeCountResponse(c.getDrinkType(), c.getCount()))
            .toList();
    }
}
