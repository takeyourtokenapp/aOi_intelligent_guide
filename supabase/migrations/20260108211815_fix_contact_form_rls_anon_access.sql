/*
  # Fix Contact Form RLS for Anonymous Users

  1. Problem
    - Policy TO public doesn't work correctly with anon role via REST API
    - Need explicit anon role support

  2. Changes
    - Drop existing policy
    - Create new policy explicitly for anon role
    - Simplify validation logic

  3. Security
    - Still validates all fields
    - Still enforces minimum requirements
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Public users can submit contact forms" ON contact_submissions;

-- Create policy explicitly for anon role
CREATE POLICY "Anonymous users can submit contact forms"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    -- user_id must be NULL for anonymous submissions
    user_id IS NULL
    -- Basic field validation
    AND sender_name IS NOT NULL
    AND sender_email IS NOT NULL
    AND subject IS NOT NULL
    AND message IS NOT NULL
    -- Length checks (after trimming whitespace)
    AND char_length(trim(sender_name)) > 0
    AND char_length(trim(sender_email)) > 0
    AND char_length(trim(subject)) > 0
    AND char_length(trim(message)) >= 3
    -- Email format validation
    AND sender_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    -- Submission type validation
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
  );

-- Add comment
COMMENT ON POLICY "Anonymous users can submit contact forms" ON contact_submissions IS 
  'Allows anonymous (anon) users to submit contact forms with validation. Minimum 3 characters in message.';