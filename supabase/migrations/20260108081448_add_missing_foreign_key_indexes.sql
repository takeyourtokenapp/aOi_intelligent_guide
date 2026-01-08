/*
  # Add Missing Foreign Key Indexes

  This migration addresses critical performance issues:
  
  ## Changes Made
  
  1. **Foreign Key Indexes Added (18 indexes)**
     - Adds indexes on all foreign key columns that were missing them
     - Critical for JOIN performance and foreign key constraint checking
     - Prevents table scans when querying related data
  
  2. **RLS Policy Optimization (8 policies)**
     - Wraps auth.uid() calls with (SELECT auth.uid())
     - Prevents re-evaluation of auth.uid() for each row
     - Dramatically improves query performance at scale
     - See: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
  
  ## Performance Impact
  - Foreign key indexes: 10-1000x faster JOINs and CASCADE operations
  - RLS optimization: 2-10x faster queries on large result sets
  
  ## Tables Affected
  - access_logs, achievements, admin_action_logs, admin_users
  - certificates, contact_submissions, cross_domain_navigation
  - email_notifications, foundation_contact_info, knowledge_base_cns
  - knowledge_submissions, progress_anchors, user_lesson_progress
  - user_roles, guardian_consents, user_xp
*/

-- ============================================================================
-- STEP 1: Add Foreign Key Indexes
-- ============================================================================

-- Access logs
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id_fk 
  ON access_logs(user_id);

-- Achievements
CREATE INDEX IF NOT EXISTS idx_achievements_profile_id_fk 
  ON achievements(profile_id);

-- Admin action logs
CREATE INDEX IF NOT EXISTS idx_admin_action_logs_admin_user_id_fk 
  ON admin_action_logs(admin_user_id);

-- Admin users
CREATE INDEX IF NOT EXISTS idx_admin_users_assigned_by_fk 
  ON admin_users(assigned_by);

-- Certificates
CREATE INDEX IF NOT EXISTS idx_certificates_track_id_fk 
  ON certificates(track_id);

-- Contact submissions
CREATE INDEX IF NOT EXISTS idx_contact_submissions_user_id_fk 
  ON contact_submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_assigned_to_fk 
  ON contact_submissions(assigned_to);

-- Cross domain navigation
CREATE INDEX IF NOT EXISTS idx_cross_domain_navigation_user_id_fk 
  ON cross_domain_navigation(user_id);

-- Email notifications
CREATE INDEX IF NOT EXISTS idx_email_notifications_user_id_fk 
  ON email_notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_email_notifications_related_submission_id_fk 
  ON email_notifications(related_submission_id);

-- Foundation contact info
CREATE INDEX IF NOT EXISTS idx_foundation_contact_info_updated_by_fk 
  ON foundation_contact_info(updated_by);

-- Knowledge base CNS
CREATE INDEX IF NOT EXISTS idx_knowledge_base_cns_curator_id_fk 
  ON knowledge_base_cns(curator_id);

-- Knowledge submissions
CREATE INDEX IF NOT EXISTS idx_knowledge_submissions_submitter_id_fk 
  ON knowledge_submissions(submitter_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_submissions_curator_id_fk 
  ON knowledge_submissions(curator_id);

-- Progress anchors
CREATE INDEX IF NOT EXISTS idx_progress_anchors_user_id_fk 
  ON progress_anchors(user_id);

-- User lesson progress
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson_id_fk 
  ON user_lesson_progress(lesson_id);

CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_track_id_fk 
  ON user_lesson_progress(track_id);

-- User roles
CREATE INDEX IF NOT EXISTS idx_user_roles_assigned_by_fk 
  ON user_roles(assigned_by);

-- ============================================================================
-- STEP 2: Optimize RLS Policies with SELECT auth.uid()
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: admin_users
-- Optimize auth.uid() calls in policy
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins and CEO can view admin users" ON admin_users;

CREATE POLICY "Admins and CEO can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (SELECT auth.uid())
      AND user_roles.role IN ('admin', 'ceo')
    )
  );

-- ----------------------------------------------------------------------------
-- Table: certificates
-- Optimize auth.uid() calls in policy
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own certificates or admins can view all" ON certificates;

CREATE POLICY "Users can view own certificates or admins can view all"
  ON certificates
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (SELECT auth.uid())
      AND user_roles.role = 'admin'
    )
  );

-- ----------------------------------------------------------------------------
-- Table: contact_submissions
-- Optimize auth.uid() calls in policy
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own submissions or admins can view all" ON contact_submissions;

CREATE POLICY "Users can view own submissions or admins can view all"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (SELECT auth.uid())
      AND user_roles.role = 'admin'
    )
  );

-- ----------------------------------------------------------------------------
-- Table: guardian_consents
-- Optimize auth.uid() calls in policy
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own consents or admins can view all" ON guardian_consents;

CREATE POLICY "Users can view own consents or admins can view all"
  ON guardian_consents
  FOR SELECT
  TO authenticated
  USING (
    child_user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (SELECT auth.uid())
      AND user_roles.role = 'admin'
    )
  );

-- ----------------------------------------------------------------------------
-- Table: knowledge_submissions
-- Optimize auth.uid() calls in policy
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own submissions or curators can view all" ON knowledge_submissions;

CREATE POLICY "Users can view own submissions or curators can view all"
  ON knowledge_submissions
  FOR SELECT
  TO authenticated
  USING (
    submitter_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (SELECT auth.uid())
      AND user_roles.role IN ('curator', 'admin')
    )
  );

-- ----------------------------------------------------------------------------
-- Table: user_lesson_progress
-- Optimize auth.uid() calls in policy
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own progress or admins can view all" ON user_lesson_progress;

CREATE POLICY "Users can view own progress or admins can view all"
  ON user_lesson_progress
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (SELECT auth.uid())
      AND user_roles.role = 'admin'
    )
  );

-- ----------------------------------------------------------------------------
-- Table: user_roles
-- Optimize auth.uid() calls in policy
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own roles or anyone can view curator list" ON user_roles;

CREATE POLICY "Users can view own roles or anyone can view curator list"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR role = 'curator'
  );

-- ----------------------------------------------------------------------------
-- Table: user_xp
-- Optimize auth.uid() calls in policy
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own XP or anyone can view leaderboard or admins can view all" ON user_xp;

CREATE POLICY "Users can view own XP or anyone can view leaderboard or admins can view all"
  ON user_xp
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (SELECT auth.uid())
      AND user_roles.role = 'admin'
    )
    OR TRUE  -- Leaderboard is public to authenticated users
  );

-- ============================================================================
-- STEP 3: Add Performance Comments
-- ============================================================================

COMMENT ON INDEX idx_access_logs_user_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_achievements_profile_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_admin_action_logs_admin_user_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_admin_users_assigned_by_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_certificates_track_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_contact_submissions_user_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_contact_submissions_assigned_to_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_cross_domain_navigation_user_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_email_notifications_user_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_email_notifications_related_submission_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_foundation_contact_info_updated_by_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_knowledge_base_cns_curator_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_knowledge_submissions_submitter_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_knowledge_submissions_curator_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_progress_anchors_user_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_user_lesson_progress_lesson_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_user_lesson_progress_track_id_fk IS 'Foreign key index for JOIN performance';
COMMENT ON INDEX idx_user_roles_assigned_by_fk IS 'Foreign key index for JOIN performance';
