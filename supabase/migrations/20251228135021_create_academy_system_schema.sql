/*
  Academy System Schema

  1. New Tables
    - owl_ranks: Defines 5 Owl ranks (Worker, Academic, Diplomat, Peacekeeper, Warrior)
    - learning_tracks: Course tracks (Crypto Foundations, Mining Essentials, etc)
    - lessons: Individual lessons within tracks
    - user_xp: User experience points and current rank
    - user_lesson_progress: Progress on individual lessons
    - certificates: Earned certificates

  2. Security
    - Public read access to tracks, lessons, ranks
    - Users can read own progress and XP
    - System manages XP and certificate awards
*/

CREATE TABLE IF NOT EXISTS owl_ranks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rank_name text NOT NULL UNIQUE,
  rank_order integer NOT NULL UNIQUE,
  xp_min integer NOT NULL,
  xp_max integer NOT NULL,
  icon_emoji text DEFAULT '',
  description_en text,
  description_ru text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS learning_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL,
  title_ru text NOT NULL,
  description_en text,
  description_ru text,
  difficulty text DEFAULT 'beginner',
  estimated_hours integer DEFAULT 0,
  xp_reward integer DEFAULT 0,
  icon text,
  track_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid REFERENCES learning_tracks(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title_en text NOT NULL,
  title_ru text NOT NULL,
  content_en text,
  content_ru text,
  lesson_type text DEFAULT 'video',
  duration_minutes integer DEFAULT 0,
  xp_reward integer DEFAULT 10,
  lesson_order integer DEFAULT 0,
  prerequisites jsonb DEFAULT '[]'::jsonb,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(track_id, slug)
);

CREATE TABLE IF NOT EXISTS user_xp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  total_xp integer DEFAULT 0,
  current_rank text DEFAULT 'Worker',
  tracks_started integer DEFAULT 0,
  lessons_completed integer DEFAULT 0,
  certificates_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  track_id uuid REFERENCES learning_tracks(id) ON DELETE CASCADE,
  status text DEFAULT 'not_started',
  progress_percent integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  xp_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  track_id uuid REFERENCES learning_tracks(id) ON DELETE CASCADE,
  certificate_type text DEFAULT 'completion',
  title_en text NOT NULL,
  title_ru text NOT NULL,
  issued_at timestamptz DEFAULT now(),
  certificate_hash text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE owl_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view owl ranks"
  ON owl_ranks FOR SELECT USING (true);

CREATE POLICY "Anyone can view published tracks"
  ON learning_tracks FOR SELECT
  USING (is_published = true);

CREATE POLICY "Anyone can view published lessons"
  ON lessons FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can view own XP"
  ON user_xp FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own progress"
  ON user_lesson_progress FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_lessons_track ON lessons(track_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_xp_rank ON user_xp(current_rank);

INSERT INTO owl_ranks (rank_name, rank_order, xp_min, xp_max, icon_emoji, description_en, description_ru) VALUES
  ('Worker', 1, 0, 99, '🦉', 'Beginning your journey in the TYT ecosystem', 'Начало вашего путешествия в экосистеме TYT'),
  ('Academic', 2, 100, 499, '📚', 'Developing deep understanding of Web3 technologies', 'Развитие глубокого понимания Web3 технологий'),
  ('Diplomat', 3, 500, 999, '🎓', 'Connecting knowledge with mission and community', 'Связь знаний с миссией и сообществом'),
  ('Peacekeeper', 4, 1000, 1999, '🕊️', 'Guardian of ecosystem values and security', 'Хранитель ценностей и безопасности экосистемы'),
  ('Warrior', 5, 2000, 999999, '⚔️', 'Master builder and protector of the mission', 'Мастер-строитель и защитник миссии')
ON CONFLICT (rank_name) DO NOTHING;

INSERT INTO learning_tracks (slug, title_en, title_ru, description_en, description_ru, difficulty, estimated_hours, xp_reward, icon, track_order) VALUES
  ('crypto-foundations', 'Crypto Foundations', 'Основы криптовалют', 'Learn the fundamentals of blockchain and cryptocurrency', 'Изучите основы блокчейна и криптовалюты', 'beginner', 8, 100, '🔐', 1),
  ('mining-essentials', 'Mining Essentials', 'Основы майнинга', 'Understanding Bitcoin mining and NFT miners', 'Понимание майнинга Bitcoin и NFT майнеров', 'intermediate', 6, 150, '⛏️', 2),
  ('web3-economy', 'Web3 Economy', 'Web3 экономика', 'Tokenomics, DeFi, and decentralized governance', 'Токеномика, DeFi и децентрализованное управление', 'intermediate', 10, 200, '💎', 3),
  ('desci-fundamentals', 'DeSci Fundamentals', 'Основы DeSci', 'Decentralized science and transparent research funding', 'Децентрализованная наука и прозрачное финансирование исследований', 'advanced', 12, 250, '🧬', 4)
ON CONFLICT (slug) DO NOTHING;
