/*
  # Fix Contact Form RLS Policies

  1. Problem
    - INSERT policy requires message > 10 characters (too strict)
    - No clear error messages for validation failures
    - Policy name confusing ("Anyone" but role is {public})

  2. Changes
    - Reduce message length requirement to >= 3 characters
    - Simplify validation rules
    - Make policy more permissive for legitimate use

  3. Security
    - Still validates all required fields
    - Still validates email format
    - Still validates submission_type enum
    - RLS remains enabled
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Anyone can create contact submissions" ON contact_submissions;

-- Create improved INSERT policy
CREATE POLICY "Public users can submit contact forms"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (
    -- user_id should be NULL for anonymous submissions
    user_id IS NULL
    -- Validate required text fields (not empty after trimming)
    AND length(TRIM(sender_name)) > 0
    AND length(TRIM(sender_email)) > 0
    AND length(TRIM(subject)) > 0
    AND length(TRIM(message)) >= 3  -- Minimum 3 characters instead of 10
    -- Validate email format (basic regex)
    AND sender_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    -- Validate submission_type is from allowed enum
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

-- Add comment for clarity
COMMENT ON POLICY "Public users can submit contact forms" ON contact_submissions IS 
  'Allows anonymous users to submit contact forms with basic validation. Requires minimum 3 characters in message, valid email format, and valid submission type.';