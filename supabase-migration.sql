-- Run this in your Supabase SQL editor (Dashboard > SQL Editor > New query)

CREATE TABLE IF NOT EXISTS bookings (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id text UNIQUE NOT NULL,
  service_id        text NOT NULL,
  service_name      text NOT NULL,
  price             integer NOT NULL,
  date              date NOT NULL,
  time              text NOT NULL,
  customer_name     text NOT NULL,
  customer_email    text NOT NULL,
  customer_phone    text NOT NULL,
  notes             text DEFAULT '',
  status            text DEFAULT 'confirmed',
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_date_idx ON bookings(date);
CREATE INDEX IF NOT EXISTS bookings_stripe_idx ON bookings(stripe_session_id);
