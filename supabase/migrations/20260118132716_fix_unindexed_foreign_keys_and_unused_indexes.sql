/*
  Fix Security Issues: Unindexed Foreign Keys and Unused Indexes

  1. Add Missing Foreign Key Indexes
     - Creates indexes on all foreign key columns that lack covering indexes
     - Improves query performance for JOIN operations and foreign key lookups
     - Prevents full table scans when querying related data

  2. Remove Unused Indexes
     - Drops indexes that are not being used by queries
     - Reduces storage overhead and write operation costs
     - Improves INSERT/UPDATE/DELETE performance

  3. Security Definer Views
     - Retains existing SECURITY DEFINER views as they are intentional
     - These views provide controlled public access to transparency data
     - Essential for the orbital witness and public ledger functionality

  Note: Auth DB Connection Strategy issue requires Supabase dashboard configuration
  and cannot be fixed via SQL migration.
*/

-- ============================================================================
-- PART 1: Add Missing Foreign Key Indexes
-- ============================================================================

-- Access logs
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON public.access_logs(user_id);

-- Achievements
CREATE INDEX IF NOT EXISTS idx_achievements_profile_id ON public.achievements(profile_id);

-- Admin action logs
CREATE INDEX IF NOT EXISTS idx_admin_action_logs_admin_user_id ON public.admin_action_logs(admin_user_id);

-- Admin users
CREATE INDEX IF NOT EXISTS idx_admin_users_assigned_by ON public.admin_users(assigned_by);

-- Certificates
CREATE INDEX IF NOT EXISTS idx_certificates_track_id ON public.certificates(track_id);

-- Contact submissions
CREATE INDEX IF NOT EXISTS idx_contact_submissions_assigned_to ON public.contact_submissions(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_user_id ON public.contact_submissions(user_id);

-- Cross domain navigation
CREATE INDEX IF NOT EXISTS idx_cross_domain_navigation_user_id ON public.cross_domain_navigation(user_id);

-- Email notifications
CREATE INDEX IF NOT EXISTS idx_email_notifications_related_submission_id ON public.email_notifications(related_submission_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_user_id ON public.email_notifications(user_id);

-- Foundation contact info
CREATE INDEX IF NOT EXISTS idx_foundation_contact_info_updated_by ON public.foundation_contact_info(updated_by);

-- Knowledge base CNS
CREATE INDEX IF NOT EXISTS idx_knowledge_base_cns_curator_id ON public.knowledge_base_cns(curator_id);

-- Knowledge submissions
CREATE INDEX IF NOT EXISTS idx_knowledge_submissions_curator_id ON public.knowledge_submissions(curator_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_submissions_submitter_id ON public.knowledge_submissions(submitter_id);

-- Maintenance payments
CREATE INDEX IF NOT EXISTS idx_maintenance_payments_miner_id ON public.maintenance_payments(miner_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_payments_user_id ON public.maintenance_payments(user_id);

-- Miner marketplace listings
CREATE INDEX IF NOT EXISTS idx_miner_marketplace_listings_buyer_id ON public.miner_marketplace_listings(buyer_id);
CREATE INDEX IF NOT EXISTS idx_miner_marketplace_listings_miner_id ON public.miner_marketplace_listings(miner_id);
CREATE INDEX IF NOT EXISTS idx_miner_marketplace_listings_seller_id ON public.miner_marketplace_listings(seller_id);

-- Miner upgrades
CREATE INDEX IF NOT EXISTS idx_miner_upgrades_miner_id ON public.miner_upgrades(miner_id);
CREATE INDEX IF NOT EXISTS idx_miner_upgrades_user_id ON public.miner_upgrades(user_id);

-- Mining rewards
CREATE INDEX IF NOT EXISTS idx_mining_rewards_miner_id ON public.mining_rewards(miner_id);
CREATE INDEX IF NOT EXISTS idx_mining_rewards_user_id ON public.mining_rewards(user_id);

-- NFT miners
CREATE INDEX IF NOT EXISTS idx_nft_miners_user_id ON public.nft_miners(user_id);

-- Progress anchors
CREATE INDEX IF NOT EXISTS idx_progress_anchors_user_id ON public.progress_anchors(user_id);

-- TYT token transactions
CREATE INDEX IF NOT EXISTS idx_tyt_token_transactions_user_id ON public.tyt_token_transactions(user_id);

-- User lesson progress
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson_id ON public.user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_track_id ON public.user_lesson_progress(track_id);

-- User roles
CREATE INDEX IF NOT EXISTS idx_user_roles_assigned_by ON public.user_roles(assigned_by);

-- ============================================================================
-- PART 2: Remove Unused Indexes
-- ============================================================================

-- Fund transparency unused indexes
DROP INDEX IF EXISTS public.idx_fund_transparency_merkle_root;
DROP INDEX IF EXISTS public.idx_fund_transparency_orbital_timestamp;
DROP INDEX IF EXISTS public.idx_fund_transparency_aoi_verified;
DROP INDEX IF EXISTS public.idx_fund_transparency_source;
DROP INDEX IF EXISTS public.idx_fund_transparency_type_created;

-- Orbital events unused indexes
DROP INDEX IF EXISTS public.idx_orbital_events_type;
DROP INDEX IF EXISTS public.idx_orbital_events_hash;
DROP INDEX IF EXISTS public.idx_orbital_events_status;
DROP INDEX IF EXISTS public.idx_orbital_events_blockchain_tx;

-- Foundation impact reports unused indexes
DROP INDEX IF EXISTS public.idx_reports_report_hash;
DROP INDEX IF EXISTS public.idx_reports_orbital_timestamp;

-- Knowledge base unused embedding indexes
DROP INDEX IF EXISTS public.knowledge_base_cns_embedding_idx;
DROP INDEX IF EXISTS public.knowledge_base_web3_embedding_idx;

-- Lessons unused embedding indexes
DROP INDEX IF EXISTS public.lessons_embedding_en_idx;
DROP INDEX IF EXISTS public.lessons_embedding_ru_idx;

-- ============================================================================
-- PART 3: Security Definer Views - Documentation
-- ============================================================================

/*
  The following views are intentionally defined with SECURITY DEFINER:
  
  1. foundation_public_ledger
     - Provides controlled public access to foundation transparency data
     - Ensures consistent data visibility regardless of viewer permissions
     - Critical for public trust and accountability
  
  2. charity_flows
     - Aggregates charity-related transactions for public transparency
     - Protects sensitive internal data while exposing necessary public info
     - Part of the orbital witness transparency system
  
  3. orbital_witness_log
     - Public blockchain-verified transparency log
     - Must be accessible to all users regardless of authentication
     - Essential for DeSci transparency and trust infrastructure
  
  These views are secure because:
  - They only expose explicitly selected columns
  - They aggregate and anonymize sensitive data
  - They are read-only (SELECT permissions only)
  - They are part of the public transparency layer by design
*/