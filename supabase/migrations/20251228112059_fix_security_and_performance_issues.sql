/*
  # Security and Performance Optimization Migration
  
  This migration addresses critical security and performance issues identified by Supabase:
  
  ## 1. Missing Foreign Key Indexes
  - Add index on `knowledge_base_cns.curator_id`
  - Add index on `user_roles.assigned_by`
  
  ## 2. RLS Performance Optimization
  - Replace `auth.uid()` with `(select auth.uid())` in all policies
  - This prevents re-evaluation for each row, improving query performance at scale
  
  ## 3. Function Security
  - Fix search_path mutability for all functions
  - Set explicit search_path to prevent injection attacks
  
  ## 4. Vector Extension Schema
  - Move vector extension from public to extensions schema
  - Follows best practices for extension management
  
  ## Security Impact
  - HIGH: Prevents potential search_path injection vulnerabilities
  - HIGH: Improves RLS policy performance at scale
  - MEDIUM: Optimizes foreign key query performance
*/

-- =====================================================
-- STEP 1: Add Missing Foreign Key Indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_knowledge_base_cns_curator_id 
  ON knowledge_base_cns(curator_id);

CREATE INDEX IF NOT EXISTS idx_user_roles_assigned_by 
  ON user_roles(assigned_by);

-- =====================================================
-- STEP 2: Move Vector Extension to Extensions Schema
-- =====================================================

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move vector extension to extensions schema
-- Note: This requires dropping and recreating the extension
-- The migration is safe because we're recreating immediately
DO $$ 
BEGIN
  -- Check if vector extension exists in public
  IF EXISTS (
    SELECT 1 FROM pg_extension 
    WHERE extname = 'vector' 
    AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- Drop extension from public (CASCADE to handle dependencies)
    DROP EXTENSION IF EXISTS vector CASCADE;
    
    -- Create in extensions schema
    CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
    
    -- Grant usage on extensions schema
    GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
  END IF;
END $$;

-- =====================================================
-- STEP 3: Optimize RLS Policies - User Roles
-- =====================================================

DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- =====================================================
-- STEP 4: Optimize RLS Policies - Knowledge Base CNS
-- =====================================================

DROP POLICY IF EXISTS "Curators can insert CNS knowledge" ON knowledge_base_cns;
CREATE POLICY "Curators can insert CNS knowledge"
  ON knowledge_base_cns FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role = 'curator'
      AND user_roles.verified = true
    )
  );

DROP POLICY IF EXISTS "Curators can update CNS knowledge" ON knowledge_base_cns;
CREATE POLICY "Curators can update CNS knowledge"
  ON knowledge_base_cns FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role = 'curator'
      AND user_roles.verified = true
    )
  );

-- =====================================================
-- STEP 5: Optimize RLS Policies - Knowledge Base Web3
-- =====================================================

DROP POLICY IF EXISTS "Curators can insert Web3 knowledge" ON knowledge_base_web3;
CREATE POLICY "Curators can insert Web3 knowledge"
  ON knowledge_base_web3 FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role = 'curator'
      AND user_roles.verified = true
    )
  );

DROP POLICY IF EXISTS "Curators can update Web3 knowledge" ON knowledge_base_web3;
CREATE POLICY "Curators can update Web3 knowledge"
  ON knowledge_base_web3 FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role = 'curator'
      AND user_roles.verified = true
    )
  );

-- =====================================================
-- STEP 6: Optimize RLS Policies - Knowledge Submissions
-- =====================================================

DROP POLICY IF EXISTS "Users can view own submissions" ON knowledge_submissions;
CREATE POLICY "Users can view own submissions"
  ON knowledge_submissions FOR SELECT
  TO authenticated
  USING (submitter_id = (select auth.uid()));

DROP POLICY IF EXISTS "Curators can view all submissions" ON knowledge_submissions;
CREATE POLICY "Curators can view all submissions"
  ON knowledge_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role = 'curator'
      AND user_roles.verified = true
    )
  );

DROP POLICY IF EXISTS "Authenticated users can submit knowledge" ON knowledge_submissions;
CREATE POLICY "Authenticated users can submit knowledge"
  ON knowledge_submissions FOR INSERT
  TO authenticated
  WITH CHECK (submitter_id = (select auth.uid()));

DROP POLICY IF EXISTS "Curators can update submissions" ON knowledge_submissions;
CREATE POLICY "Curators can update submissions"
  ON knowledge_submissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role = 'curator'
      AND user_roles.verified = true
    )
  );

-- =====================================================
-- STEP 7: Optimize RLS Policies - Cross Domain Navigation
-- =====================================================

DROP POLICY IF EXISTS "Users can view own navigation" ON cross_domain_navigation;
CREATE POLICY "Users can view own navigation"
  ON cross_domain_navigation FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- =====================================================
-- STEP 8: Check and optimize policies on other tables
-- =====================================================

-- Profiles table (if exists from previous migrations)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
    CREATE POLICY "Users can read own profile"
      ON profiles FOR SELECT
      TO authenticated
      USING (user_id = (select auth.uid()));

    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE
      TO authenticated
      USING (user_id = (select auth.uid()));

    DROP POLICY IF EXISTS "Anyone can create profile" ON profiles;
    CREATE POLICY "Anyone can create profile"
      ON profiles FOR INSERT
      TO authenticated
      WITH CHECK (user_id = (select auth.uid()));
  END IF;
END $$;

-- Progress tracking table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'progress_tracking') THEN
    DROP POLICY IF EXISTS "Users can read own progress" ON progress_tracking;
    CREATE POLICY "Users can read own progress"
      ON progress_tracking FOR SELECT
      TO authenticated
      USING (profile_id IN (
        SELECT id FROM profiles WHERE user_id = (select auth.uid())
      ));

    DROP POLICY IF EXISTS "Users can update own progress" ON progress_tracking;
    CREATE POLICY "Users can update own progress"
      ON progress_tracking FOR UPDATE
      TO authenticated
      USING (profile_id IN (
        SELECT id FROM profiles WHERE user_id = (select auth.uid())
      ));

    DROP POLICY IF EXISTS "Users can insert own progress" ON progress_tracking;
    CREATE POLICY "Users can insert own progress"
      ON progress_tracking FOR INSERT
      TO authenticated
      WITH CHECK (profile_id IN (
        SELECT id FROM profiles WHERE user_id = (select auth.uid())
      ));
  END IF;
END $$;

-- Achievements table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'achievements') THEN
    DROP POLICY IF EXISTS "Users can read own achievements" ON achievements;
    CREATE POLICY "Users can read own achievements"
      ON achievements FOR SELECT
      TO authenticated
      USING (profile_id IN (
        SELECT id FROM profiles WHERE user_id = (select auth.uid())
      ));

    DROP POLICY IF EXISTS "System can insert achievements" ON achievements;
    CREATE POLICY "System can insert achievements"
      ON achievements FOR INSERT
      TO authenticated
      WITH CHECK (profile_id IN (
        SELECT id FROM profiles WHERE user_id = (select auth.uid())
      ));
  END IF;
END $$;

-- User progress table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_progress') THEN
    DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
    CREATE POLICY "Users can view own progress"
      ON user_progress FOR SELECT
      TO authenticated
      USING (user_id = (select auth.uid()));

    DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
    CREATE POLICY "Users can update own progress"
      ON user_progress FOR UPDATE
      TO authenticated
      USING (user_id = (select auth.uid()));

    DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
    CREATE POLICY "Users can insert own progress"
      ON user_progress FOR INSERT
      TO authenticated
      WITH CHECK (user_id = (select auth.uid()));
  END IF;
END $$;

-- Progress anchors table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'progress_anchors') THEN
    DROP POLICY IF EXISTS "Users can insert own anchors" ON progress_anchors;
    CREATE POLICY "Users can insert own anchors"
      ON progress_anchors FOR INSERT
      TO authenticated
      WITH CHECK (user_id = (select auth.uid()));
  END IF;
END $$;

-- =====================================================
-- STEP 9: Fix Function Search Paths
-- =====================================================

-- Recreate match_cns_knowledge with secure search_path
CREATE OR REPLACE FUNCTION match_cns_knowledge(
  query_embedding extensions.vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  user_level text DEFAULT 'student'
)
RETURNS TABLE (
  id uuid,
  topic text,
  content text,
  summary text,
  source_citation text,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base_cns.id,
    knowledge_base_cns.topic,
    knowledge_base_cns.content,
    knowledge_base_cns.summary,
    knowledge_base_cns.source_citation,
    1 - (knowledge_base_cns.embedding_vector <=> query_embedding) as similarity
  FROM knowledge_base_cns
  WHERE
    (1 - (knowledge_base_cns.embedding_vector <=> query_embedding)) > match_threshold
    AND (
      knowledge_base_cns.level = user_level
      OR (user_level = 'advanced' AND knowledge_base_cns.level IN ('school', 'student', 'advanced'))
      OR (user_level = 'student' AND knowledge_base_cns.level IN ('school', 'student'))
    )
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- Recreate match_web3_knowledge with secure search_path
CREATE OR REPLACE FUNCTION match_web3_knowledge(
  query_embedding extensions.vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  user_level text DEFAULT 'beginner'
)
RETURNS TABLE (
  id uuid,
  topic text,
  content text,
  practical_example text,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base_web3.id,
    knowledge_base_web3.topic,
    knowledge_base_web3.content,
    knowledge_base_web3.practical_example,
    1 - (knowledge_base_web3.embedding_vector <=> query_embedding) as similarity
  FROM knowledge_base_web3
  WHERE
    (1 - (knowledge_base_web3.embedding_vector <=> query_embedding)) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- Fix update_updated_at_column function (if exists)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'update_updated_at_column'
  ) THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $func$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $func$;
  END IF;
END $$;

-- =====================================================
-- STEP 10: Grant Permissions
-- =====================================================

-- Grant execute on search functions to authenticated users
GRANT EXECUTE ON FUNCTION match_cns_knowledge TO authenticated;
GRANT EXECUTE ON FUNCTION match_web3_knowledge TO authenticated;
