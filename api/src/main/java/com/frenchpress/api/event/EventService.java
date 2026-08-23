package com.frenchpress.api.event;

import com.frenchpress.api.user.User;
import org.springframework.stereotype.Service;

@Service
public class EventService {

    private final DrinkEventRepository drinkEventRepository;

    public EventService(DrinkEventRepository drinkEventRepository) {
        this.drinkEventRepository = drinkEventRepository;
    }

    public void recordEvent(User user, DrinkType drinkType, EventType eventType) {
        drinkEventRepository.save(new DrinkEvent(user, drinkType, eventType));
    }
}
