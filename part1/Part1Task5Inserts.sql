INSERT INTO Users (username, email, password_hash, role)
VALUES
('alice123',  'alice@example.com',  'hashed123', 'owner'),
  ('bobwalker', 'bob@example.com',   'hashed456', 'walker'),
  ('carol123',  'carol@example.com', 'hashed789', 'owner'),
  ('tareq',     'tareq@example.com',  'hashed000', 'walker'),
  ('test',      'test@example.com',   'hashed111', 'owner');


INSERT INTO Dogs (owner_id, name, size)
VALUES
  ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max',    'medium'),
  ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella',  'small'),
  ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Charlie',  'large'),
  ((SELECT user_id FROM Users WHERE username = 'test'),     'Doggo',   'medium'),
  ((SELECT user_id FROM Users WHERE username = 'test'),     'Woof','small');


INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES
  ((SELECT dog_id FROM Dogs WHERE name = 'Max'),    '2025-06-10 08:00:00', 30, 'Parklands',     'open'),
  ((SELECT dog_id FROM Dogs WHERE name = 'Bella'),  '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
  ((SELECT dog_id FROM Dogs WHERE name = 'Charlie'),  '2025-06-11 07:30:00', 60, 'River Trail',   'open'),
  ((SELECT dog_id FROM Dogs WHERE name = 'Doggo'),   '2025-06-11 18:00:00', 30, 'City Park',     'open'),
  ((SELECT dog_id FROM Dogs WHERE name = 'Woof'),'2025-06-12 10:00:00', 40, 'Hillside',      'open');