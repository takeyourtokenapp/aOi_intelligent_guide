/*
  # Research Blog and Manifesto Schema

  1. New Tables
    - research_posts
      - id (uuid, primary key)
      - slug (text, unique) - URL-friendly identifier
      - title_en (text) - English title
      - title_ru (text) - Russian title
      - subtitle_en (text) - English subtitle
      - subtitle_ru (text) - Russian subtitle
      - content_en (text) - English markdown content
      - content_ru (text) - Russian markdown content
      - excerpt_en (text) - Short excerpt for cards
      - excerpt_ru (text) - Short excerpt for cards
      - post_type (text) - manifesto/update/collaboration/research
      - tags (text array) - Array of tags
      - published_at (timestamptz) - Publication date
      - author (text) - Author name (e.g., aOi)
      - featured (boolean) - Featured on homepage
      - view_count (integer) - View statistics
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - research_collaborations
      - id (uuid, primary key)
      - name (text) - Organization name
      - type (text) - research/computing/clinical/funding
      - status (text) - proposed/active/completed
      - description_en (text)
      - description_ru (text)
      - logo_url (text)
      - website (text)
      - started_at (timestamptz)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for published content
    - Admin-only write access (future implementation)
*/

-- Create research_posts table
CREATE TABLE IF NOT EXISTS research_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_en text NOT NULL,
  title_ru text NOT NULL,
  subtitle_en text,
  subtitle_ru text,
  content_en text NOT NULL,
  content_ru text NOT NULL,
  excerpt_en text,
  excerpt_ru text,
  post_type text NOT NULL DEFAULT 'update',
  tags text[] DEFAULT '{}',
  published_at timestamptz DEFAULT now(),
  author text DEFAULT 'aOi',
  featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create research_collaborations table
CREATE TABLE IF NOT EXISTS research_collaborations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'research',
  status text NOT NULL DEFAULT 'proposed',
  description_en text,
  description_ru text,
  logo_url text,
  website text,
  started_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE research_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_collaborations ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Anyone can view published research posts"
  ON research_posts
  FOR SELECT
  USING (published_at <= now());

-- Public read access for collaborations
CREATE POLICY "Anyone can view research collaborations"
  ON research_collaborations
  FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_research_posts_slug ON research_posts(slug);
CREATE INDEX IF NOT EXISTS idx_research_posts_type ON research_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_research_posts_published ON research_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_posts_featured ON research_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_research_collaborations_status ON research_collaborations(status);
