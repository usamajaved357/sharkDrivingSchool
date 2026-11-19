-- More learner details on each booking (pick-up address, experience, theory test,
-- instructor preference and free-text notes).
-- Apply: npm run db:migrate:local  |  npm run db:migrate:remote

ALTER TABLE bookings ADD COLUMN address TEXT NOT NULL DEFAULT '';
ALTER TABLE bookings ADD COLUMN experience TEXT NOT NULL DEFAULT 'none'
  CHECK (experience IN ('none', 'some', 'test-ready', 'retest'));
ALTER TABLE bookings ADD COLUMN theory_test TEXT NOT NULL DEFAULT 'not-yet'
  CHECK (theory_test IN ('passed', 'booked', 'not-yet'));
ALTER TABLE bookings ADD COLUMN instructor_pref TEXT NOT NULL DEFAULT 'any'
  CHECK (instructor_pref IN ('any', 'male', 'female'));
ALTER TABLE bookings ADD COLUMN notes TEXT NOT NULL DEFAULT '';
