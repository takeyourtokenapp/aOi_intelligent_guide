/*
  # Simplify Admin Users Structure

  1. Changes
    - Make user_id NULLABLE (remove requirement for auth.users)
    - Make contact_email NOT NULL and UNIQUE
    - Add CHECK constraint to ensure at least user_id OR contact_email exists
    - Update foreign key to allow NULL with ON DELETE SET NULL
    - Add default admin entry for immediate use

  2. Security
    - Maintain all existing RLS policies
    - No changes to access control

  3. Benefits
    - Can add admins directly by email without creating auth users
    - Simpler onboarding
    - More flexible admin management
*/

-- Drop existing foreign key constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'admin_users_user_id_fkey'
    AND table_name = 'admin_users'
  ) THEN
    ALTER TABLE admin_users DROP CONSTRAINT admin_users_user_id_fkey;
  END IF;
END $$;

-- Make user_id nullable
ALTER TABLE admin_users 
  ALTER COLUMN user_id DROP NOT NULL;

-- Make contact_email NOT NULL
UPDATE admin_users SET contact_email = 'admin@tyt.foundation' WHERE contact_email IS NULL;
ALTER TABLE admin_users 
  ALTER COLUMN contact_email SET NOT NULL;

-- Add unique constraint on contact_email
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admin_users_contact_email_unique'
  ) THEN
    ALTER TABLE admin_users ADD CONSTRAINT admin_users_contact_email_unique UNIQUE (contact_email);
  END IF;
END $$;

-- Add CHECK constraint to ensure at least one identifier exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admin_users_has_identifier'
  ) THEN
    ALTER TABLE admin_users 
      ADD CONSTRAINT admin_users_has_identifier 
      CHECK (user_id IS NOT NULL OR contact_email IS NOT NULL);
  END IF;
END $$;

-- Re-add foreign key with ON DELETE SET NULL
ALTER TABLE admin_users
  ADD CONSTRAINT admin_users_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;

-- Add default admin for immediate functionality
INSERT INTO admin_users (
  user_id,
  admin_role,
  display_name,
  contact_email,
  is_active
) VALUES (
  NULL,
  'ceo',
  'OlekF',
  'olekfribel@hotmail.com',
  true
) ON CONFLICT (contact_email) DO NOTHING;

-- Add index on contact_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_contact_email 
  ON admin_users(contact_email) 
  WHERE is_active = true;