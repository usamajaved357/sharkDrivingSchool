-- Enquiries replace time-slot bookings: learners send their details and the school
-- contacts them to arrange lessons. (The old bookings table is kept for history.)
-- Apply: npm run db:migrate:local  |  npm run db:migrate:remote

CREATE TABLE IF NOT EXISTS enquiries (
  id                  TEXT PRIMARY KEY,
  reference           TEXT NOT NULL UNIQUE,
  full_name           TEXT NOT NULL,
  gender              TEXT NOT NULL CHECK (gender IN ('male', 'female', 'prefer-not')),
  phone               TEXT NOT NULL,
  email               TEXT NOT NULL DEFAULT '',
  address             TEXT NOT NULL,
  postcode            TEXT NOT NULL,
  transmission        TEXT NOT NULL CHECK (transmission IN ('manual', 'automatic')),
  experience          TEXT NOT NULL CHECK (experience IN ('none', 'some', 'test-ready', 'retest')),
  test_booked         TEXT NOT NULL CHECK (test_booked IN ('yes', 'no')),
  test_centre         TEXT NOT NULL DEFAULT '',
  test_date           TEXT NOT NULL DEFAULT '',   -- YYYY-MM-DD
  test_time           TEXT NOT NULL DEFAULT '',   -- HH:MM
  availability        TEXT NOT NULL DEFAULT '',   -- comma-separated AVAILABILITY_OPTIONS
  availability_notes  TEXT NOT NULL DEFAULT '',
  instructor_pref     TEXT NOT NULL CHECK (instructor_pref IN ('any', 'male', 'female')),
  interest            TEXT NOT NULL DEFAULT 'not-sure',
  notes               TEXT NOT NULL DEFAULT '',
  status              TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at          TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries (created_at);
