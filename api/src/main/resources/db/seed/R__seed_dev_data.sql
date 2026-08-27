INSERT INTO users (oidc_provider, oidc_subject, email, display_name, created_at) VALUES
  ('google', 'dev-subject-1', 'ada@example.com', 'Ada Lovelace', now() - interval '10 days'),
  ('google', 'dev-subject-2', 'grace@example.com', 'Grace Hopper', now() - interval '5 days');

INSERT INTO drink_events (user_id, drink_type, event_type, created_at)
SELECT u.id, d.drink_type, d.event_type, now() - (d.days_ago || ' days')::interval
FROM users u
JOIN (
  VALUES
    ('french-press', 'VIEW', 9),
    ('french-press', 'CALCULATE', 9),
    ('french-press', 'VIEW', 6),
    ('french-press', 'CALCULATE', 6),
    ('espresso', 'VIEW', 8),
    ('espresso', 'CALCULATE', 8),
    ('espresso', 'VIEW', 3),
    ('matcha', 'VIEW', 4),
    ('matcha', 'CALCULATE', 4),
    ('cocktails', 'VIEW', 2),
    ('cocktails', 'CALCULATE', 2),
    ('cocktails', 'VIEW', 1)
) AS d(drink_type, event_type, days_ago) ON true
WHERE u.oidc_subject = 'dev-subject-1';
