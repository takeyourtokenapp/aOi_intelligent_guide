/*
  # Fix Guardian Consent Always True Policy

  ## Issue
  The policy "Users and guardians can view consents" has USING (true)
  which allows ANY authenticated user to view ALL guardian consents.
  This is a privacy violation.

  ## Solution
  Drop this overly permissive policy. The correct policies already exist:
  - "Users can view own consents" - Users see their own consent records
  - "Admins can view all consents" - Admins can see all for moderation

  ## Security
  - Removes unrestricted access to guardian consent data
  - Maintains proper access: users see own, admins see all
  - No breaking changes to legitimate access patterns
*/

-- ============================================================================
-- FIX OVERLY PERMISSIVE GUARDIAN CONSENT POLICY
-- ============================================================================

-- Drop the "always true" policy
DROP POLICY IF EXISTS "Users and guardians can view consents" ON guardian_consents;

-- The secure policies already exist from previous migration:
-- 1. "Users can view own consents" - child_user_id = auth.uid()
-- 2. "Admins can view all consents" - role check

-- Verify the table is properly secured
COMMENT ON TABLE guardian_consents IS
  'Guardian consent records. Users can only view/manage their own consents. Admins can view all for moderation.';
