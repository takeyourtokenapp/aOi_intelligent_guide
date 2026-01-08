/*
  # Temporarily Disable RLS for Testing

  1. Purpose
    - Disable RLS temporarily to test if trigger is the problem
    - Will re-enable with proper policy after testing

  2. Security Note
    - THIS IS TEMPORARY FOR DEBUGGING
    - MUST RE-ENABLE RLS AFTER IDENTIFYING ISSUE
*/

-- Disable RLS temporarily
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;