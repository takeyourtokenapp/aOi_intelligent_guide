/*
  # Enable RLS with Working Policy

  1. Solution Found
    - RLS itself was blocking - policy needs to be crafted carefully
    - Create simple, working policy

  2. Changes
    - Drop existing policies
    - Create working INSERT policy for anon
    - Re-enable RLS

  3. Security
    - Basic validation only
    - Allows legitimate contact form submissions
*/

-- Drop all INSERT policies first
DROP POLICY IF EXISTS "anon_insert_contact" ON contact_submissions;
DROP POLICY IF EXISTS "Anonymous users can submit contact forms" ON contact_submissions;
DROP POLICY IF EXISTS "Public users can submit contact forms" ON contact_submissions;
DROP POLICY IF EXISTS "Anyone can create contact submissions" ON contact_submissions;

-- Create simple working policy
CREATE POLICY "Allow anonymous contact submissions"
  ON contact_submissions
  FOR INSERT
  TO anon, public
  WITH CHECK (
    submission_type IS NOT NULL
    AND sender_name IS NOT NULL  
    AND sender_email IS NOT NULL
    AND subject IS NOT NULL
    AND message IS NOT NULL
  );

-- Re-enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Add comment
COMMENT ON POLICY "Allow anonymous contact submissions" ON contact_submissions IS 
  'Allows anonymous users to submit contact forms. Basic NOT NULL validation only.';