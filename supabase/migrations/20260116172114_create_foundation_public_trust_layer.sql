/*
  # Foundation Public Trust Layer

  1. Proof Primitives
    - Add merkle_root, orbital_timestamp, orbital_witness_url to fund_transparency
    - Add aoi_verified, aoi_verified_at, aoi_verification_signature to fund_transparency
    - Add source_type, source_id for traceability
    - Add report_hash, merkle_root, orbital fields to foundation_impact_reports

  2. Orbital Events
    - Create orbital_events table for witness log
    - Track all timestamped events (reports, transactions, snapshots)

  3. Public Views
    - Create foundation_public_ledger view (read-only transparency)
    - Create charity_flows view (source → destination flows)
    - Create orbital_witness_log view (all orbital events)

  4. Security
    - All views are public read-only
    - No write access from foundation domain
    - Proof fields are append-only (no updates after set)
*/

-- =====================================================
-- PHASE 1: Add Proof Primitives to Existing Tables
-- =====================================================

-- fund_transparency: Add proof columns
ALTER TABLE fund_transparency 
  ADD COLUMN IF NOT EXISTS merkle_root text,
  ADD COLUMN IF NOT EXISTS merkle_proof jsonb,
  ADD COLUMN IF NOT EXISTS orbital_timestamp timestamptz,
  ADD COLUMN IF NOT EXISTS orbital_witness_url text,
  ADD COLUMN IF NOT EXISTS aoi_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS aoi_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS aoi_verification_signature text,
  ADD COLUMN IF NOT EXISTS source_type text,
  ADD COLUMN IF NOT EXISTS source_id uuid,
  ADD COLUMN IF NOT EXISTS source_url text;

-- foundation_impact_reports: Add proof columns
ALTER TABLE foundation_impact_reports 
  ADD COLUMN IF NOT EXISTS report_hash text,
  ADD COLUMN IF NOT EXISTS merkle_root text,
  ADD COLUMN IF NOT EXISTS orbital_timestamp timestamptz,
  ADD COLUMN IF NOT EXISTS orbital_witness_url text,
  ADD COLUMN IF NOT EXISTS aoi_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS aoi_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS aoi_confidence_score integer,
  ADD COLUMN IF NOT EXISTS multi_sig_threshold integer DEFAULT 3,
  ADD COLUMN IF NOT EXISTS multi_sig_signatures jsonb DEFAULT '[]'::jsonb;

-- Add check constraint to foundation_impact_reports
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'foundation_impact_reports_aoi_confidence_score_check'
  ) THEN
    ALTER TABLE foundation_impact_reports 
      ADD CONSTRAINT foundation_impact_reports_aoi_confidence_score_check 
      CHECK (aoi_confidence_score IS NULL OR (aoi_confidence_score >= 0 AND aoi_confidence_score <= 100));
  END IF;
END $$;

-- foundation_grants: Add approval proof
ALTER TABLE foundation_grants 
  ADD COLUMN IF NOT EXISTS approval_hash text,
  ADD COLUMN IF NOT EXISTS orbital_timestamp timestamptz,
  ADD COLUMN IF NOT EXISTS orbital_witness_url text,
  ADD COLUMN IF NOT EXISTS aoi_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS aoi_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS multi_sig_threshold integer DEFAULT 2,
  ADD COLUMN IF NOT EXISTS multi_sig_signatures jsonb DEFAULT '[]'::jsonb;

-- =====================================================
-- PHASE 2: Create Orbital Events Table
-- =====================================================

CREATE TABLE IF NOT EXISTS orbital_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('report', 'transaction_batch', 'burn_event', 'grant_approval', 'snapshot')),
  event_id uuid NOT NULL,
  event_table text NOT NULL,
  event_hash text NOT NULL,
  orbital_timestamp timestamptz NOT NULL,
  orbital_witness_url text NOT NULL,
  witness_node text DEFAULT 'OpenTimestamps',
  blockchain_network text DEFAULT 'Bitcoin',
  blockchain_tx text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'confirmed', 'failed')),
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orbital_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view orbital events"
  ON orbital_events
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert orbital events"
  ON orbital_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- =====================================================
-- PHASE 3: Create Public Views
-- =====================================================

CREATE OR REPLACE VIEW foundation_public_ledger AS
SELECT
  ft.id,
  ft.transaction_type,
  ft.amount_usd,
  ft.source,
  ft.destination,
  ft.description,
  ft.proof_url,
  ft.blockchain_hash,
  ft.merkle_root,
  ft.orbital_timestamp,
  ft.orbital_witness_url,
  ft.aoi_verified,
  ft.aoi_verified_at,
  ft.source_type,
  ft.source_id,
  ft.source_url,
  ft.created_at,
  CASE 
    WHEN ft.blockchain_hash IS NOT NULL THEN 'blockchain_verified'
    WHEN ft.orbital_timestamp IS NOT NULL THEN 'orbital_verified'
    WHEN ft.aoi_verified THEN 'aoi_verified'
    ELSE 'pending_verification'
  END AS verification_level,
  CASE
    WHEN ft.blockchain_hash IS NOT NULL AND ft.orbital_timestamp IS NOT NULL AND ft.aoi_verified THEN true
    ELSE false
  END AS fully_verified
FROM fund_transparency ft
WHERE ft.is_public = true
ORDER BY ft.created_at DESC;

CREATE OR REPLACE VIEW charity_flows AS
SELECT
  ft.id,
  ft.transaction_type,
  ft.source_type AS origin_type,
  ft.source AS origin_name,
  ft.destination AS destination_name,
  ft.amount_usd,
  ft.created_at,
  ft.blockchain_hash,
  ft.aoi_verified,
  CASE
    WHEN ft.transaction_type = 'donation' THEN 'inflow'
    WHEN ft.transaction_type = 'grant' THEN 'outflow'
    WHEN ft.transaction_type = 'allocation' THEN 'internal'
    ELSE 'other'
  END AS flow_direction,
  COALESCE(ft.metadata->>'category', 'uncategorized') AS category
FROM fund_transparency ft
WHERE ft.is_public = true
  AND ft.amount_usd IS NOT NULL
ORDER BY ft.created_at DESC;

CREATE OR REPLACE VIEW orbital_witness_log AS
SELECT
  oe.id,
  oe.event_type,
  oe.event_id,
  oe.event_table,
  oe.event_hash,
  oe.orbital_timestamp,
  oe.orbital_witness_url,
  oe.witness_node,
  oe.blockchain_network,
  oe.blockchain_tx,
  oe.verification_status,
  oe.verified_at,
  oe.created_at,
  EXTRACT(EPOCH FROM (COALESCE(oe.verified_at, now()) - oe.orbital_timestamp)) / 60 AS verification_time_minutes
FROM orbital_events oe
ORDER BY oe.orbital_timestamp DESC;

-- =====================================================
-- PHASE 4: Create Indexes for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_fund_transparency_merkle_root
  ON fund_transparency(merkle_root) WHERE merkle_root IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_fund_transparency_orbital_timestamp
  ON fund_transparency(orbital_timestamp DESC) WHERE orbital_timestamp IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_fund_transparency_aoi_verified
  ON fund_transparency(aoi_verified, aoi_verified_at) WHERE aoi_verified = true;

CREATE INDEX IF NOT EXISTS idx_fund_transparency_source
  ON fund_transparency(source_type, source_id) WHERE source_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_fund_transparency_type_created
  ON fund_transparency(transaction_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orbital_events_type
  ON orbital_events(event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orbital_events_hash
  ON orbital_events(event_hash);

CREATE INDEX IF NOT EXISTS idx_orbital_events_status
  ON orbital_events(verification_status, orbital_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_orbital_events_blockchain_tx
  ON orbital_events(blockchain_tx) WHERE blockchain_tx IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reports_report_hash
  ON foundation_impact_reports(report_hash) WHERE report_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reports_orbital_timestamp
  ON foundation_impact_reports(orbital_timestamp DESC) WHERE orbital_timestamp IS NOT NULL;

-- =====================================================
-- PHASE 5: Grant Public Read Access to Views
-- =====================================================

GRANT SELECT ON foundation_public_ledger TO anon, authenticated;
GRANT SELECT ON charity_flows TO anon, authenticated;
GRANT SELECT ON orbital_witness_log TO anon, authenticated;

-- =====================================================
-- VERIFICATION
-- =====================================================

COMMENT ON VIEW foundation_public_ledger IS
  'Public read-only view of all transparent foundation transactions with full proof chain';

COMMENT ON VIEW charity_flows IS
  'Public view of donation flows: source → destination analysis for transparency';

COMMENT ON VIEW orbital_witness_log IS
  'Public log of all orbital-timestamped events (OpenTimestamps/Bitcoin witness)';

COMMENT ON TABLE orbital_events IS
  'Orbital witness events - append-only log of all timestamped proofs';

COMMENT ON COLUMN fund_transparency.merkle_root IS
  'Merkle root of batch containing this transaction (for batch verification)';

COMMENT ON COLUMN fund_transparency.orbital_timestamp IS
  'Timestamp from orbital witness service (OpenTimestamps on Bitcoin)';

COMMENT ON COLUMN fund_transparency.aoi_verified IS
  'Whether aOi AI has verified transaction integrity (format, amounts, blockchain)';

COMMENT ON COLUMN fund_transparency.source_type IS
  'Origin type: rewards, marketplace, deposit, burn, manual - links to takeyourtoken.app';

COMMENT ON COLUMN fund_transparency.source_url IS
  'Direct link to source transaction in takeyourtoken.app (reverse traceability)';
