package com.frenchpress.api.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DrinkEventRepository extends JpaRepository<DrinkEvent, Long> {

    @Query("""
        select e.drinkType as drinkType, count(e) as count
        from DrinkEvent e
        where e.user.id = :userId and e.eventType = :eventType
        group by e.drinkType
        order by count(e) desc
        """)
    List<DrinkTypeCount> countByUserAndEventTypeGroupedByDrinkType(
        @Param("userId") Long userId, @Param("eventType") EventType eventType);

    List<DrinkEvent> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
