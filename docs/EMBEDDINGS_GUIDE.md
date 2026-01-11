# Embeddings Generation Guide

> **Last Updated**: January 11, 2026
> **Status**: Production Ready
> **OpenAI Model**: text-embedding-3-small (1536 dimensions)

## Overview

The TYT platform uses OpenAI embeddings for semantic search across three knowledge domains:
1. **CNS Medical Knowledge** - 24 articles about pediatric brain tumors
2. **Web3/Blockchain Knowledge** - 15 articles about crypto, DeFi, DeSci
3. **Educational Lessons** - 16 lessons across 4 learning tracks

Embeddings enable aOi to provide accurate, context-aware responses using Retrieval-Augmented Generation (RAG).

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Query                           │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│          aoi-rag-query Edge Function                    │
│  • Generates embedding for user question                │
│  • Searches knowledge bases via vector similarity       │
│  • Returns relevant context                             │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│             pgvector + HNSW Indexes                     │
│  • knowledge_base_cns.embedding                         │
│  • knowledge_base_web3.embedding                        │
│  • lessons.embedding_en / embedding_ru                  │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Embedding Columns

```sql
-- CNS Knowledge Base
ALTER TABLE knowledge_base_cns
ADD COLUMN embedding vector(1536);

-- Web3 Knowledge Base
ALTER TABLE knowledge_base_web3
ADD COLUMN embedding vector(1536);

-- Lessons (multilingual)
ALTER TABLE lessons
ADD COLUMN embedding_en vector(1536),
ADD COLUMN embedding_ru vector(1536);
```

### HNSW Indexes (High Performance)

```sql
CREATE INDEX knowledge_base_cns_embedding_idx
ON knowledge_base_cns
USING hnsw (embedding vector_cosine_ops);

CREATE INDEX knowledge_base_web3_embedding_idx
ON knowledge_base_web3
USING hnsw (embedding vector_cosine_ops);

CREATE INDEX lessons_embedding_en_idx
ON lessons
USING hnsw (embedding_en vector_cosine_ops);

CREATE INDEX lessons_embedding_ru_idx
ON lessons
USING hnsw (embedding_ru vector_cosine_ops);
```

**HNSW Benefits:**
- Approximate nearest neighbor search
- 10-100x faster than sequential scan
- Configurable precision/speed tradeoff
- Optimal for high-dimensional vectors

---

## Edge Functions

### 1. generate-embeddings

**Purpose**: Generate embedding for a single piece of content

**Endpoint**: `https://[project-ref].supabase.co/functions/v1/generate-embeddings`

**Request**:
```json
{
  "text": "What is medulloblastoma?",
  "type": "cns",
  "id": "uuid-here"
}
```

**Response**:
```json
{
  "success": true,
  "embedding": [0.123, -0.456, ...], // 1536 dimensions
  "dimensions": 1536
}
```

**Types**:
- `cns` - Updates knowledge_base_cns.embedding
- `web3` - Updates knowledge_base_web3.embedding
- `lesson_en` - Updates lessons.embedding_en
- `lesson_ru` - Updates lessons.embedding_ru

---

### 2. batch-generate-embeddings

**Purpose**: Generate embeddings for ALL content without embeddings

**Endpoint**: `https://[project-ref].supabase.co/functions/v1/batch-generate-embeddings`

**Request**:
```bash
curl -X POST https://[project-ref].supabase.co/functions/v1/batch-generate-embeddings \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json"
```

**Response**:
```json
{
  "success": true,
  "timestamp": "2026-01-11T12:00:00Z",
  "results": {
    "cns": {
      "total": 24,
      "processed": 24,
      "failed": 0,
      "successRate": "100.0%"
    },
    "web3": {
      "total": 15,
      "processed": 15,
      "failed": 0,
      "successRate": "100.0%"
    },
    "lessons": {
      "total": 16,
      "processed": 16,
      "failed": 0,
      "successRate": "100.0%"
    }
  },
  "totalProcessed": 55,
  "totalFailed": 0,
  "errors": []
}
```

**Features**:
- Processes all three knowledge bases
- Handles both EN and RU lesson embeddings
- Detailed error reporting
- Skips content that already has embeddings
- Rate-limited by OpenAI API

---

### 3. aoi-rag-query

**Purpose**: Semantic search and response generation

**Endpoint**: `https://[project-ref].supabase.co/functions/v1/aoi-rag-query`

**Request**:
```json
{
  "query": "What causes medulloblastoma?",
  "queryType": "medical",
  "language": "en",
  "context": {
    "domain": "foundation",
    "userLevel": "beginner"
  }
}
```

**Response**:
```json
{
  "success": true,
  "response": "Medulloblastoma is caused by...",
  "sources": [
    {
      "title": "Understanding Medulloblastoma",
      "similarity": 0.89,
      "type": "cns"
    }
  ],
  "queryType": "medical"
}
```

**Query Types**:
- `medical` - Searches knowledge_base_cns
- `web3` - Searches knowledge_base_web3
- `academy` - Searches lessons
- `progress` - User progress tracking
- `general` - Navigation and help

---

## Search Functions

PostgreSQL functions for vector similarity search:

```sql
-- Search CNS Knowledge Base
SELECT * FROM search_knowledge_cns(
  query_embedding := '[0.123, -0.456, ...]'::vector,
  match_threshold := 0.7,
  match_count := 5
);

-- Search Web3 Knowledge Base
SELECT * FROM search_knowledge_web3(
  query_embedding := '[0.123, -0.456, ...]'::vector,
  match_threshold := 0.7,
  match_count := 5
);

-- Search Lessons (English)
SELECT * FROM search_lessons(
  query_embedding := '[0.123, -0.456, ...]'::vector,
  language := 'en',
  match_threshold := 0.7,
  match_count := 5
);
```

**Parameters**:
- `query_embedding` - Vector from OpenAI embeddings API
- `match_threshold` - Minimum similarity (0.0-1.0), default 0.7
- `match_count` - Maximum results to return, default 5
- `language` - For lessons: 'en' or 'ru'

---

## Usage Examples

### Generate All Embeddings (First Time)

```bash
# Call batch generation function
curl -X POST https://[project-ref].supabase.co/functions/v1/batch-generate-embeddings \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json"
```

**Expected Duration**: 2-5 minutes for 55 content pieces
**Cost**: ~$0.01 USD (at OpenAI pricing for text-embedding-3-small)

---

### Generate Embedding for New Content

```javascript
// Example: Add new CNS article with embedding
const article = {
  title: "New Research on Glioblastoma",
  content: "Recent studies show...",
  keywords: ["glioblastoma", "treatment", "research"]
};

// 1. Insert article
const { data: newArticle } = await supabase
  .from('knowledge_base_cns')
  .insert(article)
  .select()
  .single();

// 2. Generate embedding
const response = await fetch(
  `${supabaseUrl}/functions/v1/generate-embeddings`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: `${article.title}\n\n${article.content}\n\nKeywords: ${article.keywords.join(', ')}`,
      type: 'cns',
      id: newArticle.id
    })
  }
);
```

---

### Query with aOi RAG

```javascript
const askAoi = async (question: string) => {
  const response = await fetch(
    `${supabaseUrl}/functions/v1/aoi-rag-query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: question,
        queryType: 'medical',
        language: 'en',
        context: {
          domain: 'foundation',
          userLevel: 'explorer'
        }
      })
    }
  );

  return await response.json();
};

// Usage
const result = await askAoi("What are the symptoms of medulloblastoma?");
console.log(result.response);
console.log(result.sources); // Check sources used
```

---

## Performance Metrics

### Search Performance (with HNSW)
- **Query time**: 10-50ms for vector search
- **Index build**: ~1 second per 1000 vectors
- **Memory usage**: ~2KB per vector

### Embedding Generation
- **Time per embedding**: 100-300ms
- **Batch processing**: ~55 embeddings in 2-5 minutes
- **Rate limit**: 3,500 requests/minute (OpenAI Tier 1)

### Storage
- **Per embedding**: 6KB (1536 floats × 4 bytes)
- **Total for 55 items**: ~330KB
- **Index overhead**: ~110KB (HNSW)

---

## Best Practices

### 1. Content Preparation
```typescript
// Good: Structured, informative text
const text = `${title}\n\n${content}\n\nKeywords: ${keywords.join(', ')}`;

// Bad: Too short or generic
const text = title; // Missing context
```

### 2. Similarity Thresholds
- **0.9+**: Nearly identical content
- **0.8-0.9**: Highly relevant
- **0.7-0.8**: Relevant (recommended minimum)
- **0.6-0.7**: Somewhat related
- **<0.6**: Weak relevance

### 3. Result Count
- **Beginner users**: 3-5 results (avoid overwhelming)
- **Advanced users**: 5-10 results
- **Research mode**: 10-20 results

### 4. Multi-language Support
```javascript
// Always specify language for lessons
const searchLessons = async (query, userLanguage) => {
  const embeddingColumn = userLanguage === 'ru'
    ? 'embedding_ru'
    : 'embedding_en';

  // Use appropriate search function
  const results = await supabase.rpc('search_lessons', {
    query_embedding: queryVector,
    language: userLanguage
  });
};
```

---

## Troubleshooting

### No Results Returned

**Problem**: Query returns empty array
**Solutions**:
1. Check if embeddings exist: `SELECT COUNT(*) FROM knowledge_base_cns WHERE embedding IS NOT NULL`
2. Lower match_threshold: Try 0.6 instead of 0.7
3. Verify query embedding was generated correctly

### Low Similarity Scores

**Problem**: All results have similarity < 0.5
**Solutions**:
1. Improve query phrasing (more specific)
2. Check if content covers the topic
3. Generate embeddings for missing content

### OpenAI API Errors

**Problem**: "Rate limit exceeded" or "API key invalid"
**Solutions**:
1. Check OPENAI_API_KEY in Supabase secrets
2. Implement retry logic with exponential backoff
3. Batch requests to stay under rate limits

### Slow Search Performance

**Problem**: Queries take >500ms
**Solutions**:
1. Verify HNSW indexes exist: `\d+ knowledge_base_cns`
2. Increase shared_buffers in Postgres config
3. Reduce match_count parameter

---

## Monitoring and Maintenance

### Check Embedding Coverage

```sql
-- CNS coverage
SELECT
  COUNT(*) as total,
  COUNT(embedding) as with_embeddings,
  ROUND(100.0 * COUNT(embedding) / COUNT(*), 1) as coverage_pct
FROM knowledge_base_cns;

-- Web3 coverage
SELECT
  COUNT(*) as total,
  COUNT(embedding) as with_embeddings,
  ROUND(100.0 * COUNT(embedding) / COUNT(*), 1) as coverage_pct
FROM knowledge_base_web3;

-- Lessons coverage (English)
SELECT
  COUNT(*) as total,
  COUNT(embedding_en) as with_embeddings_en,
  COUNT(embedding_ru) as with_embeddings_ru,
  ROUND(100.0 * COUNT(embedding_en) / COUNT(*), 1) as coverage_en_pct,
  ROUND(100.0 * COUNT(embedding_ru) / COUNT(*), 1) as coverage_ru_pct
FROM lessons;
```

### Regenerate Outdated Embeddings

```sql
-- Mark embeddings for regeneration if content updated
UPDATE knowledge_base_cns
SET embedding = NULL
WHERE updated_at > created_at;

-- Then run batch-generate-embeddings
```

---

## Cost Estimation

### OpenAI Pricing (as of 2026)
- **text-embedding-3-small**: $0.00002 per 1K tokens
- **Average article**: ~500 tokens
- **Cost per embedding**: ~$0.00001

### Monthly Costs (estimated)
- **Initial generation** (55 items): $0.01
- **New content** (10 items/month): $0.0001/month
- **Query embeddings** (1000 queries/month): $0.01/month
- **Total**: ~$0.02/month

---

## Roadmap

### Phase 2 (Current) ✅
- [x] pgvector extension enabled
- [x] HNSW indexes created
- [x] Search functions implemented
- [x] generate-embeddings Edge Function
- [x] batch-generate-embeddings Edge Function
- [x] aoi-rag-query updated for RAG

### Phase 3 (Planned)
- [ ] Embedding refresh scheduler (weekly)
- [ ] Query analytics dashboard
- [ ] A/B testing different similarity thresholds
- [ ] Multi-modal embeddings (text + images)
- [ ] Fine-tuned embedding model for medical domain

### Phase 4 (Future)
- [ ] Hybrid search (vector + keyword)
- [ ] Query expansion and reformulation
- [ ] Personalized embeddings based on user history
- [ ] Federated search across multiple knowledge bases

---

## Related Documentation

- [Foundation Architecture](./FOUNDATION_ARCHITECTURE.md)
- [aOi Integration Guide](./aoi/README_AOI_INTEGRATION.md)
- [Knowledge Base Schema](./aoi/AOI_KNOWLEDGE_SCHEMA.md)
- [API Contract](./aoi/AOI_API_CONTRACT.md)

---

**Built with ❤️ by the TYT Team**
**Powered by OpenAI + pgvector + aOi (葵)**
