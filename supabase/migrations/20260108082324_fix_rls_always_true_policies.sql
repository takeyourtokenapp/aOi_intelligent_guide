/*
  # Fix RLS "Always True" Policy Issues
  
  ## Security Issues Fixed
  
  ### 1. access_logs - "System can write access logs"
  - OLD: WITH CHECK (true) - allows unrestricted inserts
  - NEW: Validates user_id matches auth.uid() when authenticated
  - System/service role can still write for audit purposes
  
  ### 2. cross_domain_navigation - "System can log navigation"
  - OLD: WITH CHECK (true) - allows unrestricted inserts
  - NEW: Validates user_id matches auth.uid() when provided
  - Allows anonymous navigation tracking (user_id = NULL)
  
  ### 3. contact_submissions - "Anyone can create contact submissions"
  - OLD: WITH CHECK (true) - allows unrestricted inserts
  - NEW: Validates required fields are not empty
  - Validates user_id matches auth.uid() when provided
  - Still allows anonymous submissions
  
  ## Important Notes
  
  These policies INTENTIONALLY allow broad access for:
  - System audit logging (access_logs)
  - Analytics tracking (cross_domain_navigation)
  - Public contact forms (contact_submissions)
  
  But now with data validation to prevent abuse and ensure integrity.
  
  ## Unused Indexes
  
  The 18 "unused" foreign key indexes are KEPT because:
  - Critical for JOIN performance as traffic grows
  - Required for efficient foreign key constraint checks
  - Used by database engine for CASCADE operations
  - Prevent table scans during RLS policy enforcement
  
  "Unused" only means not queried by application code yet.
  They are essential infrastructure, not waste.
*/

-- ============================================================================
-- 1. FIX access_logs RLS POLICY
-- ============================================================================

DROP POLICY IF EXISTS "System can write access logs" ON access_logs;

-- New policy: validate user_id if authenticated, allow service role
CREATE POLICY "System can write access logs"
  ON access_logs
  FOR INSERT
  WITH CHECK (
    -- If user_id is provided, it must match the authenticated user
    (user_id IS NULL OR user_id = auth.uid())
    AND
    -- Required fields must be present
    resource IS NOT NULL
    AND action IS NOT NULL
    AND allowed IS NOT NULL
  );

-- Allow admins/curators to view logs for security monitoring
CREATE POLICY "Admins can view access logs"
  ON access_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('curator', 'moderator', 'admin', 'ceo')
      AND user_roles.verified = true
    )
  );

-- ============================================================================
-- 2. FIX cross_domain_navigation RLS POLICY
-- ============================================================================

DROP POLICY IF EXISTS "System can log navigation" ON cross_domain_navigation;

-- New policy: validate user_id when provided, allow anonymous tracking
CREATE POLICY "System can log navigation"
  ON cross_domain_navigation
  FOR INSERT
  WITH CHECK (
    -- If user_id is provided, it must match the authenticated user
    -- OR allow NULL for anonymous navigation tracking
    (user_id IS NULL OR user_id = auth.uid())
    AND
    -- Required fields must be present
    from_domain IS NOT NULL
    AND to_domain IS NOT NULL
  );

-- ============================================================================
-- 3. FIX contact_submissions RLS POLICY
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can create contact submissions" ON contact_submissions;

-- New policy: validate required fields and user_id when provided
CREATE POLICY "Anyone can create contact submissions"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (
    -- If user_id is provided, it must match the authenticated user
    (user_id IS NULL OR user_id = auth.uid())
    AND
    -- Required fields must not be empty
    length(trim(sender_name)) > 0
    AND length(trim(sender_email)) > 0
    AND sender_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND length(trim(subject)) > 0
    AND length(trim(message)) > 10
    AND
    -- Validate submission_type is from allowed list
    submission_type IN (
      'general_inquiry',
      'support_request',
      'partnership_proposal',
      'donation_inquiry',
      'research_collaboration',
      'media_inquiry',
      'volunteer',
      'technical_issue',
      'feedback'
    )
  );

-- ============================================================================
-- 4. DOCUMENT INTENTIONAL DESIGN
-- ============================================================================

-- Update policy comments to reflect the validation added
COMMENT ON POLICY "System can write access logs" ON access_logs IS
  'INTENTIONAL: Allows system audit logging with user_id validation. Service role can write for system events. User_id must match auth.uid() when authenticated.';

COMMENT ON POLICY "System can log navigation" ON cross_domain_navigation IS
  'INTENTIONAL: Allows navigation analytics tracking with user_id validation. Anonymous tracking allowed (user_id = NULL). User_id must match auth.uid() when provided.';

COMMENT ON POLICY "Anyone can create contact submissions" ON contact_submissions IS
  'INTENTIONAL: Public contact form with validation. Requires non-empty name, valid email, subject, and message (10+ chars). User_id must match auth.uid() when provided, or be NULL for anonymous submissions.';

-- ============================================================================
-- 5. ADD COMMENTS TO DOCUMENT UNUSED INDEXES
-- ============================================================================

-- Document that "unused" foreign key indexes are intentional and critical
COMMENT ON INDEX idx_foundation_contact_info_updated_by_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_knowledge_base_cns_curator_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_access_logs_user_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_achievements_profile_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_admin_action_logs_admin_user_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_admin_users_assigned_by_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_certificates_track_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_contact_submissions_user_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_contact_submissions_assigned_to_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_cross_domain_navigation_user_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_email_notifications_user_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_email_notifications_related_submission_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_knowledge_submissions_submitter_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_knowledge_submissions_curator_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_progress_anchors_user_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_user_lesson_progress_lesson_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_user_lesson_progress_track_id_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

COMMENT ON INDEX idx_user_roles_assigned_by_fk IS
  'Foreign key index. Shows as unused in new deployments but critical for JOIN performance and constraint checking.';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify all three problematic policies are now secure
DO $$
DECLARE
  always_true_count INTEGER;
BEGIN
  -- Check for policies with WITH CHECK (true) that shouldn't have it
  SELECT COUNT(*) INTO always_true_count
  FROM pg_policies
  WHERE schemaname = 'public'
  AND tablename IN ('access_logs', 'cross_domain_navigation', 'contact_submissions')
  AND with_check = 'true';
  
  IF always_true_count > 0 THEN
    RAISE EXCEPTION 'Still have WITH CHECK (true) policies! Count: %', always_true_count;
  ELSE
    RAISE NOTICE '✓ All RLS policies now have proper validation';
  END IF;
END $$;
