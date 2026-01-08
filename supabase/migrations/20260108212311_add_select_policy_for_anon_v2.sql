/*
  # Add SELECT Policy for Anon v2

  1. Theory
    - Supabase REST API needs to SELECT after INSERT
    - Need SELECT policy for anon role

  2. Changes
    - Add SELECT policy for anon
*/

-- Drop if exists
DROP POLICY IF EXISTS "anon_select_own" ON contact_submissions;

-- Add SELECT policy for anon
CREATE POLICY "anon_select_own"
  ON contact_submissions
  FOR SELECT
  TO anon
  USING (true);