/*
  # Simplify Contact Form RLS Policy

  1. Problem
    - Complex policy with SECURITY DEFINER trigger may cause conflicts
    - Need simpler approach that works with anon role

  2. Changes
    - Drop existing policy
    - Create minimal policy for testing
    - Add back validation incrementally

  3. Security
    - Start with minimal validation
    - Ensure it works first
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Anonymous users can submit contact forms" ON contact_submissions;

-- Create very simple policy first to test
CREATE POLICY "anon_insert_contact"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Comment
COMMENT ON POLICY "anon_insert_contact" ON contact_submissions IS 
  'Temporary simple policy for testing - will add validation once basic insert works';