/*
  # Cleanup Unused Indexes and Fix RLS Policy

  1. Drop Unused Indexes
    - Remove indexes that have never been used to reduce storage overhead
    - Keep embedding indexes as they're essential for vector search

  2. Fix RLS Policy
    - Fix cross_domain_navigation INSERT policy that allows unrestricted access
    - Add proper validation to prevent abuse

  Note: Auth DB Connection Strategy must be configured in Supabase Dashboard
*/

-- =====================================================
-- 1. DROP UNUSED INDEXES
-- =====================================================

-- Foundation updates indexes
DROP INDEX IF EXISTS idx_foundation_updates_type;
DROP INDEX IF EXISTS idx_foundation_updates_featured;
DROP INDEX IF EXISTS idx_foundation_updates_published;

-- Marketplace indexes
DROP INDEX IF EXISTS idx_marketplace_buyer_id_fk;
DROP INDEX IF EXISTS idx_marketplace_seller_id_fk;
DROP INDEX IF EXISTS idx_marketplace_status;
DROP INDEX IF EXISTS idx_marketplace_miner_id;

-- Miner upgrades indexes
DROP INDEX IF EXISTS idx_miner_upgrades_miner_id_fk;
DROP INDEX IF EXISTS idx_miner_upgrades_user_id_fk;

-- NFT miners indexes
DROP INDEX IF EXISTS idx_nft_miners_user_id;
DROP INDEX IF EXISTS idx_nft_miners_is_active;

-- Mining rewards indexes
DROP INDEX IF EXISTS idx_mining_rewards_user_date;
DROP INDEX IF EXISTS idx_mining_rewards_miner_id;

-- Maintenance payments indexes
DROP INDEX IF EXISTS idx_maintenance_payments_miner_id;
DROP INDEX IF EXISTS idx_maintenance_payments_user_id;

-- TYT transactions indexes
DROP INDEX IF EXISTS idx_tyt_transactions_user_id;
DROP INDEX IF EXISTS idx_tyt_transactions_hash;

-- Foreign key indexes on various tables
DROP INDEX IF EXISTS idx_foundation_contact_info_updated_by_fk;
DROP INDEX IF EXISTS idx_knowledge_base_cns_curator_id_fk;
DROP INDEX IF EXISTS idx_access_logs_user_id_fk;
DROP INDEX IF EXISTS idx_achievements_profile_id_fk;
DROP INDEX IF EXISTS idx_admin_action_logs_admin_user_id_fk;
DROP INDEX IF EXISTS idx_admin_users_assigned_by_fk;
DROP INDEX IF EXISTS idx_certificates_track_id_fk;
DROP INDEX IF EXISTS idx_contact_submissions_user_id_fk;
DROP INDEX IF EXISTS idx_contact_submissions_assigned_to_fk;
DROP INDEX IF EXISTS idx_cross_domain_navigation_user_id_fk;
DROP INDEX IF EXISTS idx_email_notifications_user_id_fk;
DROP INDEX IF EXISTS idx_email_notifications_related_submission_id_fk;
DROP INDEX IF EXISTS idx_knowledge_submissions_submitter_id_fk;
DROP INDEX IF EXISTS idx_knowledge_submissions_curator_id_fk;
DROP INDEX IF EXISTS idx_progress_anchors_user_id_fk;
DROP INDEX IF EXISTS idx_user_lesson_progress_lesson_id_fk;
DROP INDEX IF EXISTS idx_user_lesson_progress_track_id_fk;
DROP INDEX IF EXISTS idx_user_roles_assigned_by_fk;
DROP INDEX IF EXISTS idx_admin_users_contact_email;

-- =====================================================
-- 2. FIX RLS POLICY - cross_domain_navigation
-- =====================================================

DROP POLICY IF EXISTS "System can log navigation" ON cross_domain_navigation;

CREATE POLICY "System can log navigation"
  ON cross_domain_navigation
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    from_domain IS NOT NULL AND
    length(from_domain) >= 3 AND
    to_domain IS NOT NULL AND
    length(to_domain) >= 3
  );
