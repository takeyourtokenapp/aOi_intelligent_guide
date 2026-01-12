/*
  # Fix Security and Performance Issues

  1. Foreign Key Indexes
    - Add missing indexes for foreign keys

  2. RLS Policy Optimization
    - Replace auth.uid() with (select auth.uid()) in all policies

  3. Fix Overlapping Policies
    - Separate policies by action type

  4. Fix Function Search Paths
    - Set immutable search_path for all custom functions
*/

-- =====================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_marketplace_buyer_id_fk
  ON miner_marketplace_listings(buyer_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_seller_id_fk
  ON miner_marketplace_listings(seller_id);

CREATE INDEX IF NOT EXISTS idx_miner_upgrades_miner_id_fk
  ON miner_upgrades(miner_id);

CREATE INDEX IF NOT EXISTS idx_miner_upgrades_user_id_fk
  ON miner_upgrades(user_id);

-- =====================================================
-- 2. FIX RLS POLICIES - contact_submissions
-- =====================================================

DROP POLICY IF EXISTS "anon_insert_contact_validated" ON contact_submissions;

CREATE POLICY "anon_insert_contact_validated"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    sender_name IS NOT NULL AND
    length(sender_name) >= 2 AND
    sender_email IS NOT NULL AND
    sender_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
    message IS NOT NULL AND
    length(message) >= 10
  );

-- =====================================================
-- 2. FIX RLS POLICIES - nft_miners
-- =====================================================

DROP POLICY IF EXISTS "Users can view own miners" ON nft_miners;
DROP POLICY IF EXISTS "Users can insert own miners" ON nft_miners;
DROP POLICY IF EXISTS "Users can update own miners" ON nft_miners;

CREATE POLICY "Users can view own miners"
  ON nft_miners
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own miners"
  ON nft_miners
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own miners"
  ON nft_miners
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- 2. FIX RLS POLICIES - mining_rewards
-- =====================================================

DROP POLICY IF EXISTS "Users can view own rewards" ON mining_rewards;
DROP POLICY IF EXISTS "System can insert rewards" ON mining_rewards;

CREATE POLICY "Users can view own rewards"
  ON mining_rewards
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "System can insert rewards"
  ON mining_rewards
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- 2. FIX RLS POLICIES - maintenance_payments
-- =====================================================

DROP POLICY IF EXISTS "Users can view own payments" ON maintenance_payments;
DROP POLICY IF EXISTS "Users can create payments" ON maintenance_payments;

CREATE POLICY "Users can view own payments"
  ON maintenance_payments
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create payments"
  ON maintenance_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- 2. FIX RLS POLICIES - tyt_token_transactions
-- =====================================================

DROP POLICY IF EXISTS "Users can view own transactions" ON tyt_token_transactions;
DROP POLICY IF EXISTS "Users can create transactions" ON tyt_token_transactions;

CREATE POLICY "Users can view own transactions"
  ON tyt_token_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create transactions"
  ON tyt_token_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- 2. FIX RLS POLICIES - miner_marketplace_listings
-- =====================================================

DROP POLICY IF EXISTS "Anyone can view active listings" ON miner_marketplace_listings;
DROP POLICY IF EXISTS "Sellers can create listings" ON miner_marketplace_listings;
DROP POLICY IF EXISTS "Sellers can update own listings" ON miner_marketplace_listings;

CREATE POLICY "Anyone can view active listings"
  ON miner_marketplace_listings
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Sellers can create listings"
  ON miner_marketplace_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = (select auth.uid()));

CREATE POLICY "Sellers can update own listings"
  ON miner_marketplace_listings
  FOR UPDATE
  TO authenticated
  USING (seller_id = (select auth.uid()))
  WITH CHECK (seller_id = (select auth.uid()));

-- =====================================================
-- 2. FIX RLS POLICIES - miner_upgrades
-- =====================================================

DROP POLICY IF EXISTS "Users can view own upgrades" ON miner_upgrades;
DROP POLICY IF EXISTS "Users can create upgrades" ON miner_upgrades;

CREATE POLICY "Users can view own upgrades"
  ON miner_upgrades
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create upgrades"
  ON miner_upgrades
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- 2. FIX RLS POLICIES - access_logs
-- =====================================================

DROP POLICY IF EXISTS "System can write access logs" ON access_logs;
DROP POLICY IF EXISTS "Admins can view access logs" ON access_logs;

CREATE POLICY "System can write access logs"
  ON access_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Admins can view access logs"
  ON access_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = (select auth.uid())
      AND admin_users.is_active = true
    )
  );

-- =====================================================
-- 2. FIX RLS POLICIES - cross_domain_navigation
-- =====================================================

DROP POLICY IF EXISTS "System can log navigation" ON cross_domain_navigation;

CREATE POLICY "System can log navigation"
  ON cross_domain_navigation
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- =====================================================
-- 3. FIX OVERLAPPING POLICIES - foundation_updates
-- =====================================================

DROP POLICY IF EXISTS "Public can read published updates" ON foundation_updates;
DROP POLICY IF EXISTS "Admins can manage all updates" ON foundation_updates;
DROP POLICY IF EXISTS "Admins can insert updates" ON foundation_updates;
DROP POLICY IF EXISTS "Admins can update updates" ON foundation_updates;
DROP POLICY IF EXISTS "Admins can delete updates" ON foundation_updates;

CREATE POLICY "Public can read published updates"
  ON foundation_updates
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins can insert updates"
  ON foundation_updates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = (select auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update updates"
  ON foundation_updates
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = (select auth.uid())
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = (select auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can delete updates"
  ON foundation_updates
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = (select auth.uid())
      AND admin_users.is_active = true
    )
  );

-- =====================================================
-- 4. FIX FUNCTION SEARCH PATHS
-- =====================================================

-- Drop triggers first
DROP TRIGGER IF EXISTS update_nft_miners_timestamp ON nft_miners;
DROP TRIGGER IF EXISTS update_nft_miners_updated_at ON nft_miners;

-- Drop functions with CASCADE
DROP FUNCTION IF EXISTS public.search_knowledge_cns(vector, float, int) CASCADE;
DROP FUNCTION IF EXISTS public.search_knowledge_web3(vector, float, int) CASCADE;
DROP FUNCTION IF EXISTS public.search_lessons(vector, text, float, int) CASCADE;
DROP FUNCTION IF EXISTS public.update_nft_miners_updated_at() CASCADE;

-- Recreate functions with fixed search paths
CREATE FUNCTION public.search_knowledge_cns(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  category text,
  topic text,
  content text,
  summary text,
  level text,
  source_type text,
  source_url text,
  tags text[],
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    k.id,
    k.category,
    k.topic,
    k.content,
    k.summary,
    k.level,
    k.source_type,
    k.source_url,
    k.tags,
    1 - (k.embedding <=> query_embedding) as similarity
  FROM knowledge_base_cns k
  WHERE k.embedding IS NOT NULL
    AND 1 - (k.embedding <=> query_embedding) > match_threshold
  ORDER BY k.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

CREATE FUNCTION public.search_knowledge_web3(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  category text,
  topic text,
  content text,
  summary text,
  level text,
  source_type text,
  source_url text,
  tags text[],
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    k.id,
    k.category,
    k.topic,
    k.content,
    k.summary,
    k.level,
    k.source_type,
    k.source_url,
    k.tags,
    1 - (k.embedding <=> query_embedding) as similarity
  FROM knowledge_base_web3 k
  WHERE k.embedding IS NOT NULL
    AND 1 - (k.embedding <=> query_embedding) > match_threshold
  ORDER BY k.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

CREATE FUNCTION public.search_lessons(
  query_embedding vector(1536),
  lang text DEFAULT 'en',
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  content text,
  track_id uuid,
  lesson_order int,
  difficulty text,
  duration_minutes int,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lang = 'ru' THEN
    RETURN QUERY
    SELECT
      l.id,
      l.title_ru as title,
      l.description_ru as description,
      l.content_ru as content,
      l.track_id,
      l.lesson_order,
      l.difficulty,
      l.duration_minutes,
      1 - (l.embedding_ru <=> query_embedding) as similarity
    FROM lessons l
    WHERE l.embedding_ru IS NOT NULL
      AND 1 - (l.embedding_ru <=> query_embedding) > match_threshold
    ORDER BY l.embedding_ru <=> query_embedding
    LIMIT match_count;
  ELSE
    RETURN QUERY
    SELECT
      l.id,
      l.title_en as title,
      l.description_en as description,
      l.content_en as content,
      l.track_id,
      l.lesson_order,
      l.difficulty,
      l.duration_minutes,
      1 - (l.embedding_en <=> query_embedding) as similarity
    FROM lessons l
    WHERE l.embedding_en IS NOT NULL
      AND 1 - (l.embedding_en <=> query_embedding) > match_threshold
    ORDER BY l.embedding_en <=> query_embedding
    LIMIT match_count;
  END IF;
END;
$$;

CREATE FUNCTION public.update_nft_miners_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_nft_miners_updated_at
  BEFORE UPDATE ON nft_miners
  FOR EACH ROW
  EXECUTE FUNCTION update_nft_miners_updated_at();
