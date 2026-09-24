package com.frenchpress.api.event;

import com.frenchpress.api.AbstractIntegrationTest;
import com.frenchpress.api.user.User;
import com.frenchpress.api.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

class DrinkEventRepositoryTest extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DrinkEventRepository drinkEventRepository;

    @Test
    void countsEventsGroupedByDrinkTypeForOneUserAndEventType() {
        User user = userRepository.save(new User("google", "subject-3", "c@example.com", "Charlie"));
        drinkEventRepository.save(new DrinkEvent(user, DrinkType.FRENCH_PRESS, EventType.VIEW));
        drinkEventRepository.save(new DrinkEvent(user, DrinkType.FRENCH_PRESS, EventType.VIEW));
        drinkEventRepository.save(new DrinkEvent(user, DrinkType.ESPRESSO, EventType.VIEW));
        drinkEventRepository.save(new DrinkEvent(user, DrinkType.ESPRESSO, EventType.CALCULATE));

        var counts = drinkEventRepository.countByUserAndEventTypeGroupedByDrinkType(user.getId(), EventType.VIEW);

        assertThat(counts).hasSize(2);
        assertThat(counts.get(0).getDrinkType()).isEqualTo(DrinkType.FRENCH_PRESS);
        assertThat(counts.get(0).getCount()).isEqualTo(2L);
    }

    @Test
    void findsMostRecentEventsForUserInDescendingOrder() {
        User user = userRepository.save(new User("google", "subject-2", "b@example.com", "Bob"));
        drinkEventRepository.save(new DrinkEvent(user, DrinkType.MATCHA, EventType.VIEW));
        drinkEventRepository.save(new DrinkEvent(user, DrinkType.COCKTAILS, EventType.CALCULATE));

        var recent = drinkEventRepository.findTop10ByUserIdOrderByCreatedAtDesc(user.getId());

        assertThat(recent).hasSize(2);
        assertThat(recent.get(0).getDrinkType()).isEqualTo(DrinkType.COCKTAILS);
    }
}
