/*
  # Add Embedding Columns for Vector Search

  1. Changes
    - Add `embedding` vector(1536) column to `knowledge_base_cns` table
    - Add `embedding` vector(1536) column to `knowledge_base_web3` table
    - Add `embedding` vector(1536) column to `lessons` table
    - Create indexes for vector similarity search using HNSW algorithm
    
  2. Purpose
    - Enable AI-powered semantic search using OpenAI embeddings
    - Support RAG (Retrieval Augmented Generation) for aOi assistant
    - Allow users to find relevant content based on meaning, not just keywords
    
  3. Technical Details
    - Vector dimension: 1536 (OpenAI text-embedding-3-small)
    - Index type: HNSW (Hierarchical Navigable Small World) for fast approximate nearest neighbor search
    - Distance metric: Cosine similarity (default for HNSW)
*/

-- Add embedding column to knowledge_base_cns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'knowledge_base_cns' AND column_name = 'embedding'
  ) THEN
    ALTER TABLE knowledge_base_cns 
    ADD COLUMN embedding vector(1536);
  END IF;
END $$;

-- Add embedding column to knowledge_base_web3
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'knowledge_base_web3' AND column_name = 'embedding'
  ) THEN
    ALTER TABLE knowledge_base_web3 
    ADD COLUMN embedding vector(1536);
  END IF;
END $$;

-- Add embedding columns to lessons (for both EN and RU content)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lessons' AND column_name = 'embedding_en'
  ) THEN
    ALTER TABLE lessons 
    ADD COLUMN embedding_en vector(1536);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lessons' AND column_name = 'embedding_ru'
  ) THEN
    ALTER TABLE lessons 
    ADD COLUMN embedding_ru vector(1536);
  END IF;
END $$;

-- Create HNSW indexes for fast vector similarity search
-- HNSW is optimized for high-dimensional vectors and provides excellent performance

-- Index for CNS knowledge base
CREATE INDEX IF NOT EXISTS knowledge_base_cns_embedding_idx 
ON knowledge_base_cns 
USING hnsw (embedding vector_cosine_ops);

-- Index for Web3 knowledge base
CREATE INDEX IF NOT EXISTS knowledge_base_web3_embedding_idx 
ON knowledge_base_web3 
USING hnsw (embedding vector_cosine_ops);

-- Indexes for lessons (separate for each language)
CREATE INDEX IF NOT EXISTS lessons_embedding_en_idx 
ON lessons 
USING hnsw (embedding_en vector_cosine_ops);

CREATE INDEX IF NOT EXISTS lessons_embedding_ru_idx 
ON lessons 
USING hnsw (embedding_ru vector_cosine_ops);

-- Create helper function for semantic search in CNS knowledge base
CREATE OR REPLACE FUNCTION search_knowledge_cns(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  category text,
  topic text,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base_cns.id,
    knowledge_base_cns.category,
    knowledge_base_cns.topic,
    knowledge_base_cns.content,
    1 - (knowledge_base_cns.embedding <=> query_embedding) as similarity
  FROM knowledge_base_cns
  WHERE knowledge_base_cns.embedding IS NOT NULL
    AND 1 - (knowledge_base_cns.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_base_cns.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create helper function for semantic search in Web3 knowledge base
CREATE OR REPLACE FUNCTION search_knowledge_web3(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  category text,
  topic text,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base_web3.id,
    knowledge_base_web3.category,
    knowledge_base_web3.topic,
    knowledge_base_web3.content,
    1 - (knowledge_base_web3.embedding <=> query_embedding) as similarity
  FROM knowledge_base_web3
  WHERE knowledge_base_web3.embedding IS NOT NULL
    AND 1 - (knowledge_base_web3.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_base_web3.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create helper function for semantic search in lessons
CREATE OR REPLACE FUNCTION search_lessons(
  query_embedding vector(1536),
  language text DEFAULT 'en',
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  slug text,
  title text,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF language = 'ru' THEN
    RETURN QUERY
    SELECT
      lessons.id,
      lessons.slug,
      lessons.title_ru as title,
      lessons.content_ru as content,
      1 - (lessons.embedding_ru <=> query_embedding) as similarity
    FROM lessons
    WHERE lessons.embedding_ru IS NOT NULL
      AND 1 - (lessons.embedding_ru <=> query_embedding) > match_threshold
      AND lessons.is_published = true
    ORDER BY lessons.embedding_ru <=> query_embedding
    LIMIT match_count;
  ELSE
    RETURN QUERY
    SELECT
      lessons.id,
      lessons.slug,
      lessons.title_en as title,
      lessons.content_en as content,
      1 - (lessons.embedding_en <=> query_embedding) as similarity
    FROM lessons
    WHERE lessons.embedding_en IS NOT NULL
      AND 1 - (lessons.embedding_en <=> query_embedding) > match_threshold
      AND lessons.is_published = true
    ORDER BY lessons.embedding_en <=> query_embedding
    LIMIT match_count;
  END IF;
END;
$$;