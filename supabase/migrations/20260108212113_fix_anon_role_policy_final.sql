/*
  # Fix Anonymous Role Policy - Final Solution

  1. Problem
    - Need explicit anon role, not public group
    - Supabase REST API uses anon role specifically

  2. Solution
    - Drop existing policy
    - Create policy ONLY for anon role (not public)
    - Use minimal validation

  3. Security
    - Validates required fields are not null
    - Keeps it simple
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Allow anonymous contact submissions" ON contact_submissions;

-- Create policy explicitly for anon role only
CREATE POLICY "anon_can_insert_contact_forms"
  ON contact_submissions
  AS PERMISSIVE
  FOR INSERT
  TO anon
  WITH CHECK (
    submission_type IS NOT NULL
    AND sender_name IS NOT NULL  
    AND sender_email IS NOT NULL
    AND subject IS NOT NULL
    AND message IS NOT NULL
  );