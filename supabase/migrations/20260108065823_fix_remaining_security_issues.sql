/*
  # Fix Remaining Security Issues

  ## Issues Addressed

  ### 1. Critical: RLS Policies Always True (2 policies fixed)
  - guardian_consents: "Authenticated users can manage consents" - Too permissive
  - guardian_consents: "Users can update consents" - Too permissive
  
  These policies allowed ANY authenticated user to create/update ANY consent.
  Fixed to ensure users can only manage their own consents.

  ### 2. Intentional "Always True" Policies (Documented, Not Changed)
  - access_logs: "System can write access logs" - Intentional for system logging
  - contact_submissions: "Anyone can create contact submissions" - Intentional public form
  - cross_domain_navigation: "System can log navigation" - Intentional for analytics

  ### 3. Unused Indexes (Selective Removal)
  - Removing truly redundant duplicate indexes
  - Keeping indexes that will be used when app has traffic
  - Keeping all foreign key indexes (critical for performance)

  ### 4. Multiple Permissive Policies (Documented as Intentional)
  - admin_users: Hierarchy (admins SELECT, CEO ALL) - Correct
  - contact_submissions: Users see own, admins see all - Correct
  - knowledge_submissions: Users see own, curators see all - Correct
  - user_roles: Public curator list + users see own - Correct

  ## Security
  - Critical guardian consent security hole fixed
  - No breaking changes to intentional public/system access
  - Maintains all existing functionality
*/

-- ============================================================================
-- 1. FIX CRITICAL SECURITY ISSUE - Guardian Consents
-- ============================================================================

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can manage consents" ON guardian_consents;
DROP POLICY IF EXISTS "Users can update consents" ON guardian_consents;

-- Create secure policies: Users can only manage consents for their own child account
CREATE POLICY "Users can create consent for their own account"
  ON guardian_consents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    child_user_id = (select auth.uid())
  );

-- Users can view consents where they are the child
CREATE POLICY "Users can view own consents"
  ON guardian_consents
  FOR SELECT
  TO authenticated
  USING (
    child_user_id = (select auth.uid())
  );

-- Users can update consents for their own account (e.g., revoke consent)
CREATE POLICY "Users can update own consents"
  ON guardian_consents
  FOR UPDATE
  TO authenticated
  USING (
    child_user_id = (select auth.uid())
  )
  WITH CHECK (
    child_user_id = (select auth.uid())
  );

-- Admins can view all consents for moderation
CREATE POLICY "Admins can view all consents"
  ON guardian_consents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role IN ('ceo', 'admin', 'moderator')
    )
  );

-- ============================================================================
-- 2. REMOVE TRULY REDUNDANT INDEXES
-- ============================================================================

-- Remove duplicate/redundant indexes on contact_submissions
-- We have idx_contact_submissions_status_created (composite) so don't need these separate ones
DROP INDEX IF EXISTS idx_contact_submissions_status;
DROP INDEX IF EXISTS idx_contact_submissions_created;
DROP INDEX IF EXISTS idx_contact_submissions_type;

-- Keep idx_contact_submissions_user (used for "view own submissions")
-- Keep idx_contact_submissions_assigned (used for admin dashboard)
-- Keep idx_contact_submissions_status_created (composite, replaces the above)

-- Remove redundant indexes on email_notifications  
-- We have idx_email_notifications_status_created (composite) so don't need these
DROP INDEX IF EXISTS idx_email_notifications_status;
DROP INDEX IF EXISTS idx_email_notifications_created;
DROP INDEX IF EXISTS idx_email_notifications_type;

-- Keep idx_email_notifications_user_id (foreign key)
-- Keep idx_email_notifications_related_submission (foreign key)
-- Keep idx_email_notifications_status_created (composite, replaces the above)

-- Remove redundant indexes on admin_users
-- These will be used when app has traffic, but we have better composite index
DROP INDEX IF EXISTS idx_admin_users_role;
DROP INDEX IF EXISTS idx_admin_users_active;

-- Keep idx_admin_users_assigned_by (foreign key, needed for performance)

-- Remove redundant single-column indexes on user_roles
-- We have idx_user_roles_user_role_composite which covers these
DROP INDEX IF EXISTS idx_user_roles_user;
DROP INDEX IF EXISTS idx_user_roles_role;

-- Keep idx_user_roles_user_role_composite (composite, replaces the above)
-- Keep idx_user_roles_assigned_by (foreign key audit trail)

-- Remove truly unused indexes on tables with no current usage
DROP INDEX IF EXISTS idx_profiles_user_id;
DROP INDEX IF EXISTS idx_profiles_user_level;
DROP INDEX IF EXISTS idx_progress_tracking_profile;
DROP INDEX IF EXISTS idx_progress_tracking_module;
DROP INDEX IF EXISTS idx_achievements_profile;
DROP INDEX IF EXISTS idx_achievements_type;
DROP INDEX IF EXISTS idx_user_progress_user_id;
DROP INDEX IF EXISTS idx_user_progress_level;

-- Remove unused indexes on low-traffic system tables
DROP INDEX IF EXISTS idx_access_logs_user;
DROP INDEX IF EXISTS idx_access_logs_timestamp;
DROP INDEX IF EXISTS idx_access_logs_resource;
DROP INDEX IF EXISTS idx_navigation_user;
DROP INDEX IF EXISTS idx_navigation_timestamp;

-- ============================================================================
-- 3. KEEP STRATEGIC INDEXES (Document why we're keeping them)
-- ============================================================================

-- Keep all foreign key indexes (performance critical):
COMMENT ON INDEX idx_admin_users_assigned_by IS
  'Foreign key index - KEEP for JOIN performance';

COMMENT ON INDEX idx_certificates_track_id IS
  'Foreign key index - KEEP for JOIN performance';

COMMENT ON INDEX idx_email_notifications_related_submission IS
  'Foreign key index - KEEP for JOIN performance';

COMMENT ON INDEX idx_email_notifications_user_id IS
  'Foreign key index - KEEP for JOIN performance';

COMMENT ON INDEX idx_foundation_contact_info_updated_by IS
  'Foreign key index - KEEP for JOIN performance';

COMMENT ON INDEX idx_user_lesson_progress_track_id IS
  'Foreign key index - KEEP for JOIN performance';

-- Keep strategic business logic indexes (will be used as app grows):
COMMENT ON INDEX idx_contact_submissions_user IS
  'Used by RLS policy "Users can view own submissions" - KEEP';

COMMENT ON INDEX idx_contact_submissions_assigned IS
  'Used by admin dashboard - KEEP';

COMMENT ON INDEX idx_guardian_consents_child_user_id IS
  'Used by guardian consent policies - KEEP';

COMMENT ON INDEX idx_guardian_consents_guardian_email IS
  'Used for guardian lookup - KEEP';

COMMENT ON INDEX idx_progress_anchors_user_id IS
  'Used for user progress tracking - KEEP';

COMMENT ON INDEX idx_progress_anchors_milestone_type IS
  'Used for milestone queries - KEEP';

COMMENT ON INDEX idx_admin_logs_admin_user IS
  'Used for admin audit trail - KEEP';

COMMENT ON INDEX idx_admin_logs_timestamp IS
  'Used for admin audit queries - KEEP';

-- Keep knowledge base indexes (will be heavily used when content loads):
COMMENT ON INDEX idx_cns_category IS
  'Used for knowledge base filtering - KEEP';

COMMENT ON INDEX idx_cns_level IS
  'Used for knowledge base difficulty filtering - KEEP';

COMMENT ON INDEX idx_cns_tags IS
  'Used for knowledge base search - KEEP';

COMMENT ON INDEX idx_web3_category IS
  'Used for knowledge base filtering - KEEP';

COMMENT ON INDEX idx_web3_level IS
  'Used for knowledge base difficulty filtering - KEEP';

COMMENT ON INDEX idx_web3_tags IS
  'Used for knowledge base search - KEEP';

COMMENT ON INDEX idx_knowledge_base_cns_curator_id IS
  'Used for curator dashboard - KEEP';

COMMENT ON INDEX idx_submissions_status IS
  'Used for knowledge submission workflows - KEEP';

COMMENT ON INDEX idx_submissions_submitter IS
  'Used for user submission history - KEEP';

COMMENT ON INDEX idx_submissions_curator IS
  'Used for curator dashboard - KEEP';

-- Keep foundation indexes (will be used when donations/grants are active):
COMMENT ON INDEX idx_fund_transparency_type IS
  'Used for transparency reports - KEEP';

COMMENT ON INDEX idx_fund_transparency_created IS
  'Used for chronological transparency - KEEP';

COMMENT ON INDEX idx_donations_status IS
  'Used for donation processing - KEEP';

COMMENT ON INDEX idx_donations_created IS
  'Used for donation history - KEEP';

COMMENT ON INDEX idx_grants_status IS
  'Used for grant management - KEEP';

COMMENT ON INDEX idx_reports_type IS
  'Used for report categorization - KEEP';

COMMENT ON INDEX idx_reports_period IS
  'Used for periodic reports - KEEP';

-- Keep research indexes:
COMMENT ON INDEX idx_research_posts_featured IS
  'Used for featured research display - KEEP';

COMMENT ON INDEX idx_research_collaborations_status IS
  'Used for collaboration management - KEEP';

-- Keep academy indexes (will be heavily used):
COMMENT ON INDEX idx_lessons_track IS
  'Used for lesson organization - KEEP';

COMMENT ON INDEX idx_user_progress_user IS
  'Used for user progress tracking - KEEP';

COMMENT ON INDEX idx_user_progress_lesson IS
  'Used for lesson completion tracking - KEEP';

COMMENT ON INDEX idx_certificates_user IS
  'Used for user certificate display - KEEP';

COMMENT ON INDEX idx_user_xp_rank IS
  'Used for leaderboard queries - KEEP';

-- ============================================================================
-- 4. ADD DOCUMENTATION FOR INTENTIONAL "ALWAYS TRUE" POLICIES
-- ============================================================================

-- Document why these policies are intentionally permissive
COMMENT ON POLICY "System can write access logs" ON access_logs IS
  'INTENTIONAL: System logging requires unrestricted INSERT. Access controlled at application layer.';

COMMENT ON POLICY "Anyone can create contact submissions" ON contact_submissions IS
  'INTENTIONAL: Public contact form. Rate limiting and validation handled at application/edge function layer.';

COMMENT ON POLICY "System can log navigation" ON cross_domain_navigation IS
  'INTENTIONAL: Navigation tracking requires unrestricted INSERT. No sensitive data stored.';

-- ============================================================================
-- 5. ADD DOCUMENTATION FOR MULTIPLE PERMISSIVE POLICIES
-- ============================================================================

-- These are intentional hierarchical or multi-view access patterns
COMMENT ON TABLE admin_users IS
  'Multiple SELECT policies intentional: Admins can view list, CEO can manage (ALL includes SELECT)';

COMMENT ON TABLE contact_submissions IS
  'Multiple SELECT policies intentional: Users see own submissions, admins see all submissions';

COMMENT ON TABLE knowledge_submissions IS
  'Multiple SELECT policies intentional: Users see own submissions, curators see all submissions';

COMMENT ON TABLE user_roles IS
  'Multiple SELECT policies intentional: Public curator list (transparency) + users see own roles';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Count remaining indexes
DO $$
DECLARE
  index_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO index_count
  FROM pg_stat_user_indexes
  WHERE schemaname = 'public';
  
  RAISE NOTICE 'Total indexes after cleanup: %', index_count;
END $$;
