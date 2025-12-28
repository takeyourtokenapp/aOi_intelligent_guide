# aOi API Contract Specification

## Overview

This document defines the API contract between `takeyourtoken.app` (client) and `tyt.foundation` (aOi server).

**Critical Architecture**:
- aOi agent lives on `tyt.foundation`
- `takeyourtoken.app` is a client that calls aOi API
- Edge Function (`aoi-rag-query`) handles all AI logic
- Fallback mode when Foundation API is unavailable

---

## Client-Side Interfaces

### Location
`/src/services/foundationApi.ts`

### TypeScript Interfaces

```typescript
interface AoiContext {
  topic: string;
  userLevel?: 'beginner' | 'explorer' | 'builder' | 'guardian';
  language?: string;
  currentDomain?: 'app' | 'foundation';
}

interface AoiResponse {
  explanation: string;
  relatedTools?: string[];
  foundationLink?: string;
  appLink?: string;
  category: 'navigation' | 'education' | 'context' | 'general';
}

interface FoundationStatus {
  online: boolean;
  lastChecked: Date;
  apiVersion?: string;
}
```

---

## Foundation API Endpoints

### Base URL
```
https://tyt.foundation/api
```

---

### 1. Health Check

**Endpoint**: `GET /api/health`

**Purpose**: Check if Foundation API is available

**Request**: None (GET only)

**Response**:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2025-12-28T10:00:00.000Z"
}
```

**Headers**:
- `X-API-Version`: API version string

**Status Codes**:
- `200`: Service healthy
- `503`: Service unavailable

**Client Behavior**:
- Timeout: 5 seconds
- On failure: Enable fallback mode
- On success: Update status, disable fallback

**Implementation Example**:
```typescript
const response = await fetch('https://tyt.foundation/api/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  signal: AbortSignal.timeout(5000),
});

if (response.ok) {
  const data = await response.json();
  console.log('API Version:', data.version);
}
```

---

### 2. Ask aOi

**Endpoint**: `POST /api/aoi/ask`

**Purpose**: Main AI query endpoint

**Request Body**:
```json
{
  "topic": "What is blockchain?",
  "userLevel": "beginner",
  "language": "en",
  "currentDomain": "app"
}
```

**Request Schema**:
```typescript
{
  topic: string;              // Required: User question
  userLevel?: string;         // Optional: beginner | explorer | builder | guardian
  language?: string;          // Optional: ISO language code (default: 'en')
  currentDomain?: string;     // Optional: 'app' | 'foundation'
}
```

**Response**:
```json
{
  "explanation": "Blockchain is a decentralized ledger technology...",
  "category": "education",
  "relatedTools": ["academy", "blockchain-basics"],
  "foundationLink": "https://tyt.foundation/knowledge/blockchain",
  "appLink": "https://takeyourtoken.app/academy/blockchain-101"
}
```

**Response Schema**:
```typescript
{
  explanation: string;        // Main answer text
  category: string;           // 'navigation' | 'education' | 'context' | 'general'
  relatedTools?: string[];    // Array of related resource IDs
  foundationLink?: string;    // Full URL to Foundation content
  appLink?: string;           // Full URL to App content
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request (missing required fields)
- `429`: Rate limit exceeded
- `500`: Internal server error
- `503`: Service unavailable (triggers fallback)

**Client Behavior**:
- Timeout: 10 seconds
- Retries: 3 attempts
- On failure: Use fallback response
- Cache responses: 5 minutes

**Implementation Example**:
```typescript
const response = await fetch('https://tyt.foundation/api/aoi/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    topic: 'What is medulloblastoma?',
    userLevel: 'beginner',
    currentDomain: 'app',
  }),
  signal: AbortSignal.timeout(10000),
});

const data: AoiResponse = await response.json();
```

---

### 3. Get Recommendations

**Endpoint**: `GET /api/aoi/recommendations`

**Purpose**: Get personalized recommendations based on user context

**Query Parameters**:
```
?userId={uuid}&level={string}&domain={string}
```

**Response**:
```json
{
  "recommendations": [
    {
      "type": "course",
      "title": "Blockchain Fundamentals",
      "url": "https://takeyourtoken.app/academy/blockchain-101",
      "reason": "Based on your progress in Web3"
    },
    {
      "type": "knowledge",
      "title": "Understanding Brain Tumors",
      "url": "https://tyt.foundation/knowledge/brain-tumors",
      "reason": "Learn about our mission"
    }
  ]
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized (invalid userId)
- `404`: User not found
- `500`: Internal server error

---

## Edge Function Contract

### Endpoint
```
POST /functions/v1/aoi-rag-query
```

**Internal Use Only**: Called by Foundation API, not directly by clients

### Request

```typescript
interface QueryRequest {
  question: string;            // User question
  userId: string;              // User ID (UUID)
  userLevel: string;           // beginner | explorer | builder | guardian
  domain: 'foundation' | 'app'; // Request origin
  context?: any;               // Additional context (miners, progress, etc.)
}
```

**Example**:
```json
{
  "question": "What is medulloblastoma?",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "userLevel": "beginner",
  "domain": "app",
  "context": {
    "hasMiners": false,
    "coursesCompleted": 2
  }
}
```

### Response

```typescript
interface QueryResponse {
  response: string;           // Generated answer
  queryType: string;          // 'medical' | 'web3' | 'progress' | 'general'
  sources: string;            // Data source identifier
}
```

**Example**:
```json
{
  "response": "Based on educational medical research:\n\nMedulloblastoma is...\n\n⚠️ Important: This is educational information only...",
  "queryType": "medical",
  "sources": "knowledge_base"
}
```

### Query Classification

```typescript
function classifyQuery(question: string): QueryType {
  const lowerQ = question.toLowerCase();

  if (contains(['progress', 'achievement', 'level'])) return 'progress';
  if (contains(['brain', 'tumor', 'cancer', 'medical'])) return 'medical';
  if (contains(['blockchain', 'crypto', 'mining', 'token'])) return 'web3';

  return 'general';
}
```

### Knowledge Base Tables

The Edge Function queries these Supabase tables:

```sql
-- Medical knowledge
knowledge_base_cns (
  id UUID PRIMARY KEY,
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  source_citation TEXT,
  age_appropriate BOOLEAN DEFAULT true,
  safety_level TEXT DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Web3 knowledge
knowledge_base_web3 (
  id UUID PRIMARY KEY,
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  practical_example TEXT,
  difficulty_level TEXT,
  related_courses TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
)

-- User progress
user_progress (
  user_id UUID PRIMARY KEY,
  level TEXT DEFAULT 'Beginner',
  level_progress INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  certificates_earned INTEGER DEFAULT 0,
  foundation_contribution INTEGER DEFAULT 0,
  owl_rank TEXT DEFAULT 'Worker',
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Interaction logging
aoi_interactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  interaction_type TEXT,
  question TEXT,
  response TEXT,
  platform TEXT, -- 'app' | 'foundation'
  created_at TIMESTAMPTZ DEFAULT now()
)
```

---

## Fallback Mode

When Foundation API is unavailable, client uses local smart responses.

### Fallback Response Structure

```typescript
interface FallbackResponse {
  explanation: string;
  category: string;
  relatedTools?: string[];
  foundationLink?: string;
  appLink?: string;
}
```

### Fallback Topics

#### 1. Web3/Blockchain
```typescript
{
  explanation: "Web3 and blockchain are decentralized technologies...",
  relatedTools: ['academy', 'blockchain-basics', 'web3-intro'],
  category: 'education',
  appLink: 'https://takeyourtoken.app/academy'
}
```

#### 2. Medical/Research
```typescript
{
  explanation: "TYT Foundation supports children's brain cancer research...",
  foundationLink: 'https://tyt.foundation/foundation',
  category: 'context'
}
```

#### 3. About aOi
```typescript
{
  explanation: "I'm aOi (葵), your navigation assistant between technology and medicine...",
  category: 'general',
  relatedTools: ['about', 'mission']
}
```

#### 4. NFT/Mining/Tokens
```typescript
{
  explanation: "TYT uses NFT miners and the TYT token to create a sustainable funding model...",
  category: 'education',
  relatedTools: ['nft-miners', 'tokenomics', 'academy']
}
```

#### 5. Learning/Academy
```typescript
{
  explanation: "The TYT Academy offers comprehensive courses on Web3, blockchain...",
  appLink: 'https://takeyourtoken.app/academy',
  category: 'navigation',
  relatedTools: ['academy', 'courses', 'certificates']
}
```

#### 6. Default/General
```typescript
{
  explanation: "I'm here to help you navigate the TYT ecosystem. You can ask me about:...",
  category: 'general',
  relatedTools: ['academy', 'knowledge', 'foundation']
}
```

---

## Error Handling

### Client-Side Errors

```typescript
try {
  const response = await foundationApi.askAoi(context);
} catch (error) {
  if (error.name === 'AbortError') {
    // Timeout - use fallback
    return getFallbackResponse(context);
  }
  if (error.status === 429) {
    // Rate limit - show message
    return { explanation: 'Too many requests. Please try again later.' };
  }
  // Other errors - use fallback
  return getFallbackResponse(context);
}
```

### Server-Side Errors

Edge Function should return proper HTTP codes:

```typescript
// 400 Bad Request
if (!question || !userId) {
  return new Response(
    JSON.stringify({ error: 'Missing required fields' }),
    { status: 400, headers: corsHeaders }
  );
}

// 500 Internal Server Error
try {
  // ... logic
} catch (error) {
  console.error('Error in aoi-rag-query:', error);
  return new Response(
    JSON.stringify({ error: error.message }),
    { status: 500, headers: corsHeaders }
  );
}
```

---

## Security

### CORS Headers

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};
```

### Rate Limiting

- **Health endpoint**: No limit
- **Ask endpoint**: 60 requests/minute per IP
- **Recommendations**: 30 requests/minute per user

### Authentication

- Public endpoints: `/health`, `/aoi/ask` (with rate limiting)
- Protected endpoints: `/aoi/recommendations` (requires userId validation)
- No API keys required for public queries

### Data Privacy

- NO personal health information (PHI) in requests or responses
- NO financial data in logs
- User IDs only for tracking progress (no PII)
- All interactions logged for safety audit

---

## Testing

### Health Check Test
```bash
curl https://tyt.foundation/api/health
# Expected: {"status":"ok","version":"1.0.0","timestamp":"..."}
```

### Ask aOi Test
```bash
curl -X POST https://tyt.foundation/api/aoi/ask \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "What is blockchain?",
    "userLevel": "beginner",
    "currentDomain": "app"
  }'
```

### Error Handling Test
```bash
# Missing required field
curl -X POST https://tyt.foundation/api/aoi/ask \
  -H "Content-Type: application/json" \
  -d '{}'
# Expected: 400 Bad Request
```

---

## Versioning

Current version: **1.0.0**

Version header: `X-API-Version: 1.0.0`

### Version History
- `1.0.0` (2025-12-28): Initial API specification

### Breaking Changes Policy
- Major version bump (2.0.0): Breaking changes
- Minor version bump (1.1.0): New features, backward compatible
- Patch version bump (1.0.1): Bug fixes only

---

## Monitoring

### Metrics to Track

- Request count per endpoint
- Average response time
- Error rate (4xx, 5xx)
- Fallback mode activation rate
- Knowledge base hit rate
- User satisfaction (implicit: retry rate)

### Alerts

- Error rate > 5%
- Response time > 3 seconds
- Fallback mode > 30 minutes
- Database query errors

---

## Integration Checklist

- [ ] Foundation API deployed at `tyt.foundation/api`
- [ ] Edge Function deployed (`aoi-rag-query`)
- [ ] Knowledge base tables populated
- [ ] CORS headers configured
- [ ] Rate limiting enabled
- [ ] Health check endpoint responding
- [ ] Client fallback mode tested
- [ ] Error handling verified
- [ ] Logging enabled
- [ ] Monitoring dashboard configured

---

**Last Updated**: 2025-12-28
**Status**: Active Specification
**Maintained By**: TYT Development Team
