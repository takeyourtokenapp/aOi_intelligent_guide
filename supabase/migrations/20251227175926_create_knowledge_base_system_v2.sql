/*
  # Knowledge Base System for aOi Self-Learning AI Agent
  
  ## Overview
  This migration creates the infrastructure for aOi's self-learning capabilities,
  implementing a RAG (Retrieval-Augmented Generation) system with human-in-the-loop
  curation for accurate medical and Web3 knowledge.
  
  ## New Tables
  
  1. knowledge_base_cns - CNS research knowledge
  2. knowledge_base_web3 - Web3 technology knowledge
  3. knowledge_submissions - Curator review queue
  4. user_roles - Role assignments (curator, researcher, admin)
  5. cross_domain_navigation - Cross-domain tracking
  6. access_logs - Security audit logs
  
  ## Features
  
  - Vector embeddings for semantic search (RAG)
  - Human-in-the-loop curation workflow
  - Multi-level content (school/student/advanced)
  - Trusted source tracking
  - Age-appropriate filtering
  - Cross-domain synchronization
  - Access control audit trail
*/

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. User Roles (create first as it's referenced by other tables)
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  role text NOT NULL,
  specialization text,
  verified boolean DEFAULT false,
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- 2. CNS Research Knowledge Base
CREATE TABLE IF NOT EXISTS knowledge_base_cns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  topic text NOT NULL,
  content text NOT NULL,
  summary text,
  level text NOT NULL DEFAULT 'student',
  source_type text NOT NULL,
  source_url text,
  source_citation text,
  trustworthiness_score integer DEFAULT 50,
  last_verified timestamptz DEFAULT now(),
  curator_id uuid REFERENCES auth.users(id),
  curator_notes text,
  embedding_vector vector(1536),
  tags text[] DEFAULT '{}',
  age_appropriate boolean DEFAULT true,
  requires_guardian boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cns_embedding ON knowledge_base_cns USING ivfflat (embedding_vector vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_cns_category ON knowledge_base_cns(category);
CREATE INDEX IF NOT EXISTS idx_cns_level ON knowledge_base_cns(level);
CREATE INDEX IF NOT EXISTS idx_cns_tags ON knowledge_base_cns USING gin(tags);

-- 3. Web3 Knowledge Base
CREATE TABLE IF NOT EXISTS knowledge_base_web3 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  topic text NOT NULL,
  content text NOT NULL,
  level text NOT NULL DEFAULT 'beginner',
  practical_example text,
  code_snippet text,
  related_tools text[] DEFAULT '{}',
  embedding_vector vector(1536),
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_web3_embedding ON knowledge_base_web3 USING ivfflat (embedding_vector vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_web3_category ON knowledge_base_web3(category);
CREATE INDEX IF NOT EXISTS idx_web3_level ON knowledge_base_web3(level);
CREATE INDEX IF NOT EXISTS idx_web3_tags ON knowledge_base_web3 USING gin(tags);

-- 4. Knowledge Submissions
CREATE TABLE IF NOT EXISTS knowledge_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_id uuid REFERENCES auth.users(id),
  submitter_type text DEFAULT 'user',
  knowledge_type text NOT NULL,
  category text NOT NULL,
  topic text NOT NULL,
  content text NOT NULL,
  source_url text,
  source_citation text,
  status text DEFAULT 'pending',
  curator_id uuid REFERENCES auth.users(id),
  curator_notes text,
  trustworthiness_score integer,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_status ON knowledge_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitter ON knowledge_submissions(submitter_id);
CREATE INDEX IF NOT EXISTS idx_submissions_curator ON knowledge_submissions(curator_id);

-- 5. Cross-Domain Navigation
CREATE TABLE IF NOT EXISTS cross_domain_navigation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  from_domain text NOT NULL,
  to_domain text NOT NULL,
  from_path text,
  to_path text,
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_navigation_user ON cross_domain_navigation(user_id);
CREATE INDEX IF NOT EXISTS idx_navigation_timestamp ON cross_domain_navigation(timestamp);

-- 6. Access Logs
CREATE TABLE IF NOT EXISTS access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  resource text NOT NULL,
  action text NOT NULL,
  allowed boolean NOT NULL,
  reason text,
  user_level text,
  ip_address text,
  user_agent text,
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_access_logs_user ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_timestamp ON access_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_access_logs_resource ON access_logs(resource);

-- Now apply RLS policies

-- User Roles policies
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Public curator list"
  ON user_roles FOR SELECT
  USING (role = 'curator' AND verified = true);

-- CNS Knowledge policies
ALTER TABLE knowledge_base_cns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read age-appropriate CNS knowledge"
  ON knowledge_base_cns FOR SELECT
  USING (age_appropriate = true);

CREATE POLICY "Curators can insert CNS knowledge"
  ON knowledge_base_cns FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'curator'
      AND user_roles.verified = true
    )
  );

CREATE POLICY "Curators can update CNS knowledge"
  ON knowledge_base_cns FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'curator'
      AND user_roles.verified = true
    )
  );

-- Web3 Knowledge policies
ALTER TABLE knowledge_base_web3 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read Web3 knowledge"
  ON knowledge_base_web3 FOR SELECT
  USING (true);

CREATE POLICY "Curators can insert Web3 knowledge"
  ON knowledge_base_web3 FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'curator'
      AND user_roles.verified = true
    )
  );

CREATE POLICY "Curators can update Web3 knowledge"
  ON knowledge_base_web3 FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'curator'
      AND user_roles.verified = true
    )
  );

-- Knowledge Submissions policies
ALTER TABLE knowledge_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions"
  ON knowledge_submissions FOR SELECT
  TO authenticated
  USING (submitter_id = auth.uid());

CREATE POLICY "Curators can view all submissions"
  ON knowledge_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'curator'
      AND user_roles.verified = true
    )
  );

CREATE POLICY "Authenticated users can submit knowledge"
  ON knowledge_submissions FOR INSERT
  TO authenticated
  WITH CHECK (submitter_id = auth.uid());

CREATE POLICY "Curators can update submissions"
  ON knowledge_submissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'curator'
      AND user_roles.verified = true
    )
  );

-- Cross-Domain Navigation policies
ALTER TABLE cross_domain_navigation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own navigation"
  ON cross_domain_navigation FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can log navigation"
  ON cross_domain_navigation FOR INSERT
  WITH CHECK (true);

-- Access Logs policies
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can write access logs"
  ON access_logs FOR INSERT
  WITH CHECK (true);

-- Vector search functions

CREATE OR REPLACE FUNCTION match_cns_knowledge(
  query_embedding vector(1536),
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

CREATE OR REPLACE FUNCTION match_web3_knowledge(
  query_embedding vector(1536),
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
