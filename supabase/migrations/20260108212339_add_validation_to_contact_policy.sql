/*
  # Add Validation to Contact Form Policy

  1. Solution Found
    - Need both INSERT and SELECT policies for anon
    - Supabase REST API needs SELECT to return inserted data

  2. Changes
    - Update INSERT policy with proper validation
    - Keep SELECT policy as-is

  3. Security
    - Validates required fields
    - Validates email format
    - Validates message length (min 3 chars)
    - Validates submission type enum
*/

-- Drop and recreate INSERT policy with validation
DROP POLICY IF EXISTS "anon_insert" ON contact_submissions;

CREATE POLICY "anon_insert_contact_validated"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Required fields
    submission_type IS NOT NULL
    AND sender_name IS NOT NULL  
    AND sender_email IS NOT NULL
    AND subject IS NOT NULL
    AND message IS NOT NULL
    -- Length validation
    AND char_length(trim(sender_name)) > 0
    AND char_length(trim(sender_email)) > 0
    AND char_length(trim(subject)) > 0
    AND char_length(trim(message)) >= 3
    -- Email format
    AND sender_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    -- Submission type enum
    AND submission_type IN (
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
    -- user_id must be NULL for anonymous
    AND (user_id IS NULL OR user_id = auth.uid())
  );

-- Add helpful comment
COMMENT ON POLICY "anon_insert_contact_validated" ON contact_submissions IS 
  'Allows anonymous users to submit contact forms with full validation: email format, min message length (3 chars), valid submission type.';