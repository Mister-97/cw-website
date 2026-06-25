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
  engineer          text DEFAULT '',
  status            text DEFAULT 'confirmed',
  created_at        timestamptz DEFAULT now()
);

-- If the table already exists, run this to add the engineer column:
-- ALTER TABLE bookings ADD COLUMN IF NOT EXISTS engineer text DEFAULT '';

CREATE INDEX IF NOT EXISTS bookings_date_idx ON bookings(date);
CREATE INDEX IF NOT EXISTS bookings_stripe_idx ON bookings(stripe_session_id);

-- Run these if upgrading an existing bookings table:
-- ALTER TABLE bookings ALTER COLUMN stripe_session_id DROP NOT NULL;
-- ALTER TABLE bookings ADD COLUMN IF NOT EXISTS engineer text;
-- ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'unpaid';

-- Services table (managed via admin portal at /admin/services)
CREATE TABLE IF NOT EXISTS services (
  id            text PRIMARY KEY,
  name          text NOT NULL,
  description   text NOT NULL DEFAULT '',
  duration      text NOT NULL DEFAULT '',
  duration_mins integer NOT NULL DEFAULT 0,
  price         integer NOT NULL DEFAULT 0,
  price_note    text,
  category      text NOT NULL DEFAULT 'recording' CHECK (category IN ('recording', 'production', 'post', 'content')),
  featured      boolean NOT NULL DEFAULT false,
  includes      text[] NOT NULL DEFAULT '{}',
  best_for      text,
  sort_order    integer NOT NULL DEFAULT 0,
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Seed with existing services (run once)
INSERT INTO services (id, name, description, duration, duration_mins, price, price_note, category, featured, includes, best_for, sort_order, active) VALUES
  ('quick-song', 'Record a Quick Song', 'Come in for a quick session and knock out one song. Perfect for artists who know exactly what they want.', '1.5 hrs', 90, 65, NULL, 'recording', false, '{}', NULL, 1, true),
  ('early-bird', 'Early Bird Session', '2-hour session block at a discounted rate. Must start before 1PM early bird gets the beat.', '2 hrs', 120, 80, NULL, 'recording', true, '{}', NULL, 2, true),
  ('recording-2hr', '2hr Recording Session', 'Perfect for singles, punch-ins, freestyles, hooks, or quick vocal sessions. Come prepared and lock in with professional sound in a creative environment.', '2 hrs', 120, 100, NULL, 'recording', false, ARRAY['Professional recording','Basic vocal leveling','Session file save'], '1 song or quick vocal work', 3, true),
  ('recording-3hr', '3hr Recording Session', 'Three hours of uninterrupted professional studio time to dig into your music.', '3 hrs', 180, 150, NULL, 'recording', false, '{}', NULL, 4, true),
  ('recording-4hr', '4hr Recording Session', 'The perfect balance for serious artists looking to fully lock into their sound without feeling rushed. Ideal for multiple songs, vocal layering, and creative experimentation.', '4 hrs', 240, 200, NULL, 'recording', true, ARRAY['Professional recording','Vocal arrangement assistance','Rough mix preview','Session file save'], '2-4 songs or full creative sessions', 5, true),
  ('full-day', '8 Hour Full Studio Day', 'Built for artists ready to create at a high level. A full day to record, shoot content, experiment with sounds, and focus on your music without watching the clock.', '8 hrs', 480, 400, NULL, 'recording', true, ARRAY['Full-day studio access','Professional engineering','Priority session workflow','Creative flexibility','Rough mixes included'], 'EPs, albums, content days, or serious artist development', 6, true),
  ('custom-production', 'Recording + Custom Production', 'Bring your vision to life with a complete session that includes custom beat production tailored to your unique sound. Our producers build your beat, then you record all in one session.', '2 hrs', 120, 200, NULL, 'production', true, ARRAY['Custom beat creation','Full recording session','Artist collaboration','Session file save'], NULL, 7, true),
  ('custom-beat', 'Custom Beat Production', 'A sound built specifically around your vision and style. Perfect for artists wanting original production tailored to their voice and brand.', '2 hrs', 120, 140, NULL, 'production', false, ARRAY['Custom production','Artist collaboration','Revisions included','WAV delivery'], NULL, 8, true),
  ('beats-lease', 'Beats for Lease', 'Wide selection of professional beats available for immediate lease. Starting at $150.', '30 mins', 30, 150, 'From $150', 'production', false, '{}', NULL, 9, true),
  ('beat-license', 'Beat License', 'Secure the rights to your selected beat for your upcoming release. High-quality production ready for recording and distribution. Exclusive rights available upon request.', '30 mins', 30, 0, 'Price varies', 'production', false, ARRAY['High-quality WAV file','MP3 version','Basic license agreement'], NULL, 10, true),
  ('mixing-mastering', 'Mixing & Mastering', 'Take your song from demo quality to release-ready. Vocals and production balanced, cleaned, and enhanced for professional streaming across all major platforms.', '3-5 business days', 0, 175, NULL, 'post', false, ARRAY['Vocal balancing','EQ & compression','Effects processing','Stereo mastering','Streaming-ready export'], NULL, 11, true),
  ('bandlab-mix', 'BandLab Mix & Master', 'Recorded on BandLab and ready to level up? Bring your project in and we''ll give it a professional finish.', '1 hr', 60, 60, NULL, 'post', false, '{}', NULL, 12, true),
  ('show-mix', 'Show Mix / Live Set', 'Got a show with limited performance time? Let us put together your show mix so you sound great from the jump.', '1 hr', 60, 50, NULL, 'post', false, '{}', NULL, 13, true),
  ('video-shoot', 'Lab Video Shoot', 'Come to the lab and get high-quality content for your next music video. Studio environment, professional lighting, real energy.', '1 hr', 60, 50, NULL, 'content', false, '{}', NULL, 14, true)
ON CONFLICT (id) DO NOTHING;
