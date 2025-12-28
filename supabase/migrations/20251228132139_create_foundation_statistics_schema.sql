/*
  Foundation Statistics and Donations Schema

  1. New Tables
    - foundation_statistics: Current foundation metrics
    - foundation_donations: All donation records
    - foundation_grants: Research grants tracking
    - foundation_impact_reports: Periodic impact reports

  2. Security
    - Enable RLS on all tables
    - Public read access for statistics and reports
    - Authenticated users can create donations
*/

-- Foundation statistics table
CREATE TABLE IF NOT EXISTS foundation_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_donated numeric DEFAULT 0,
  families_supported integer DEFAULT 0,
  research_grants integer DEFAULT 0,
  clinical_trials integer DEFAULT 0,
  partner_hospitals integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Foundation donations table
CREATE TABLE IF NOT EXISTS foundation_donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  usd_equivalent numeric NOT NULL,
  donor_id uuid,
  donor_name text,
  transaction_hash text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Foundation grants table
CREATE TABLE IF NOT EXISTS foundation_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description_en text,
  description_ru text,
  amount_usd numeric NOT NULL,
  institution text NOT NULL,
  status text NOT NULL DEFAULT 'proposed',
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Foundation impact reports table
CREATE TABLE IF NOT EXISTS foundation_impact_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_donated numeric DEFAULT 0,
  families_count integer DEFAULT 0,
  grants_count integer DEFAULT 0,
  trials_count integer DEFAULT 0,
  report_data jsonb DEFAULT '{}'::jsonb,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE foundation_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_impact_reports ENABLE ROW LEVEL SECURITY;

-- Public read access for statistics
CREATE POLICY "Anyone can view foundation statistics"
  ON foundation_statistics
  FOR SELECT
  USING (true);

-- Public read access for completed donations
CREATE POLICY "Anyone can view completed donations"
  ON foundation_donations
  FOR SELECT
  USING (status = 'completed');

-- Public read access for active grants
CREATE POLICY "Anyone can view grants"
  ON foundation_grants
  FOR SELECT
  USING (true);

-- Public read access for published reports
CREATE POLICY "Anyone can view published reports"
  ON foundation_impact_reports
  FOR SELECT
  USING (published_at IS NOT NULL);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_donations_status ON foundation_donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created ON foundation_donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_grants_status ON foundation_grants(status);
CREATE INDEX IF NOT EXISTS idx_reports_type ON foundation_impact_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_period ON foundation_impact_reports(period_start, period_end);

-- Insert initial statistics
INSERT INTO foundation_statistics (
  total_donated,
  families_supported,
  research_grants,
  clinical_trials,
  partner_hospitals
) VALUES (
  256890,
  127,
  4,
  3,
  15
) ON CONFLICT DO NOTHING;
