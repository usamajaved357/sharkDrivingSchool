-- Initial schema for Shark Driving School.
-- Apply: npm run db:migrate:local  |  npm run db:migrate:remote

CREATE TABLE IF NOT EXISTS bookings (
  id            TEXT PRIMARY KEY,
  reference     TEXT NOT NULL UNIQUE,
  transmission  TEXT NOT NULL CHECK (transmission IN ('manual', 'automatic')),
  lesson_type   TEXT NOT NULL,
  date          TEXT NOT NULL,          -- YYYY-MM-DD (Europe/London)
  time          TEXT NOT NULL,          -- HH:MM
  full_name     TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT NOT NULL,
  postcode      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at    TEXT NOT NULL
);

-- One active booking per slot for now (single instructor).
-- When multiple instructors are added, include instructor_id in this index.
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_active_slot
  ON bookings (date, time) WHERE status != 'cancelled';

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (date);

CREATE TABLE IF NOT EXISTS contact_messages (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TEXT NOT NULL
);
