# aOi Knowledge Base Schema

## Overview

This document defines the complete schema for aOi's knowledge base, including medical (CNS) knowledge, Web3 knowledge, user progress tracking, and interaction logging.

**Database**: Supabase PostgreSQL
**RLS**: Enabled on all tables
**Migration**: See `/supabase/migrations/`

---

## Table of Contents

1. [Medical Knowledge (CNS)](#medical-knowledge-cns)
2. [Web3 Knowledge](#web3-knowledge)
3. [User Progress](#user-progress)
4. [Interaction Logging](#interaction-logging)
5. [Guardian Consents](#guardian-consents)
6. [Content Guidelines](#content-guidelines)
7. [Data Management](#data-management)

---

## Medical Knowledge (CNS)

### Table: `knowledge_base_cns`

**Purpose**: Educational content about pediatric brain tumors, CNS research, and medical science.

**Schema**:
```sql
CREATE TABLE knowledge_base_cns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  source_citation TEXT,
  age_appropriate BOOLEAN DEFAULT true,
  safety_level TEXT DEFAULT 'public',
  keywords TEXT[],
  last_reviewed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_cns_topic ON knowledge_base_cns(topic);
CREATE INDEX idx_cns_keywords ON knowledge_base_cns USING GIN(keywords);
CREATE INDEX idx_cns_age_appropriate ON knowledge_base_cns(age_appropriate);

-- RLS
ALTER TABLE knowledge_base_cns ENABLE ROW LEVEL SECURITY;

-- Public read access for age-appropriate content
CREATE POLICY "Public can read age-appropriate CNS knowledge"
  ON knowledge_base_cns FOR SELECT
  TO public
  USING (age_appropriate = true AND safety_level = 'public');

-- Authenticated users can read all public content
CREATE POLICY "Authenticated users can read all public CNS knowledge"
  ON knowledge_base_cns FOR SELECT
  TO authenticated
  USING (safety_level = 'public');
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Primary key |
| `topic` | TEXT | Yes | Topic title (e.g., "Medulloblastoma Overview") |
| `content` | TEXT | Yes | Educational content (Markdown supported) |
| `source_citation` | TEXT | No | PubMed link, DOI, or source |
| `age_appropriate` | BOOLEAN | Yes | Safe for minors (default: true) |
| `safety_level` | TEXT | Yes | 'public' or 'restricted' |
| `keywords` | TEXT[] | No | Search keywords |
| `last_reviewed` | TIMESTAMPTZ | No | Last content review date |
| `created_at` | TIMESTAMPTZ | Yes | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Yes | Last update timestamp |

### Example Entry

```json
{
  "topic": "Medulloblastoma Overview",
  "content": "Medulloblastoma (MB) is the most common malignant brain tumor in children, accounting for approximately 20% of pediatric CNS tumors. It primarily affects the cerebellum and can spread through cerebrospinal fluid...\n\n## Key Facts\n- Most common in children aged 5-9\n- Four molecular subgroups: WNT, SHH, Group 3, Group 4\n- Requires multidisciplinary treatment\n\n⚠️ This is educational information only. Always consult qualified medical professionals.",
  "source_citation": "https://pubmed.ncbi.nlm.nih.gov/12345678/",
  "age_appropriate": true,
  "safety_level": "public",
  "keywords": ["medulloblastoma", "pediatric brain tumor", "cerebellum", "CNS"],
  "last_reviewed": "2025-12-28T00:00:00Z"
}
```

### Content Guidelines

**Language Level**:
- 8th-grade reading level
- No medical jargon without explanation
- Use analogies and simple terms

**Must Include**:
- Medical disclaimer
- Source citation
- Last reviewed date
- Age-appropriate flag

**Must NOT Include**:
- Graphic medical imagery descriptions
- Prognosis predictions
- Treatment recommendations
- Specific patient cases

**Topics Covered**:
- Pediatric brain tumors (types, research)
- CNS anatomy (educational)
- Research challenges
- Technology needs (AI, quantum computing)
- How Web3 supports research
- Foundation mission context

---

## Web3 Knowledge

### Table: `knowledge_base_web3`

**Purpose**: Educational content about blockchain, crypto, Web3, and digital infrastructure.

**Schema**:
```sql
CREATE TABLE knowledge_base_web3 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  practical_example TEXT,
  difficulty_level TEXT DEFAULT 'beginner',
  related_courses TEXT[],
  keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_web3_topic ON knowledge_base_web3(topic);
CREATE INDEX idx_web3_difficulty ON knowledge_base_web3(difficulty_level);
CREATE INDEX idx_web3_keywords ON knowledge_base_web3 USING GIN(keywords);

-- RLS
ALTER TABLE knowledge_base_web3 ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read Web3 knowledge"
  ON knowledge_base_web3 FOR SELECT
  TO public
  USING (true);
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Primary key |
| `topic` | TEXT | Yes | Topic title (e.g., "Blockchain Basics") |
| `content` | TEXT | Yes | Educational content (Markdown supported) |
| `practical_example` | TEXT | No | Code snippet or practical example |
| `difficulty_level` | TEXT | Yes | 'beginner', 'intermediate', or 'advanced' |
| `related_courses` | TEXT[] | No | Array of related course IDs |
| `keywords` | TEXT[] | No | Search keywords |
| `created_at` | TIMESTAMPTZ | Yes | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Yes | Last update timestamp |

### Example Entry

```json
{
  "topic": "What is Blockchain?",
  "content": "A blockchain is like a shared notebook that everyone can read, but no one can erase or change past entries. Each page (block) contains transactions, and pages are linked together in a chain.\n\n## Key Properties\n1. **Decentralized**: No single owner\n2. **Immutable**: Cannot change past records\n3. **Transparent**: Everyone can verify\n\nIn the TYT ecosystem, blockchain ensures transparent tracking of donations to medical research.",
  "practical_example": "// Simple blockchain concept\nconst block = {\n  index: 1,\n  timestamp: Date.now(),\n  data: 'Donation to TYT Foundation',\n  previousHash: '0000...',\n  hash: calculateHash()\n};",
  "difficulty_level": "beginner",
  "related_courses": ["blockchain-101", "web3-fundamentals"],
  "keywords": ["blockchain", "decentralized", "ledger", "transparency"]
}
```

### Content Guidelines

**Start with "What" and "Why"**:
- What is this technology?
- Why does it matter?
- How does it connect to TYT mission?

**Use Analogies**:
- Blockchain = shared notebook
- Smart contract = vending machine
- Wallet = digital keychain
- Token = arcade token

**No Jargon Without Explanation**:
- First use: "NFT (Non-Fungible Token) is..."
- Then use: "NFT"

**Include Practical Examples**:
- Code snippets
- Real-world use cases
- TYT ecosystem examples

**Disclaimers**:
- No investment advice
- No price predictions
- Educational purpose only

---

## User Progress

### Table: `user_progress`

**Purpose**: Track user learning progress, achievements, and ecosystem participation.

**Schema**:
```sql
CREATE TABLE user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  level TEXT DEFAULT 'Beginner',
  level_progress INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  certificates_earned INTEGER DEFAULT 0,
  foundation_contribution INTEGER DEFAULT 0,
  owl_rank TEXT DEFAULT 'Worker',
  age_group TEXT,
  guardian_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_progress_level ON user_progress(level);
CREATE INDEX idx_progress_rank ON user_progress(owl_rank);
CREATE INDEX idx_progress_age_group ON user_progress(age_group);

-- RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Users can read their own progress
CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- System can insert new user progress
CREATE POLICY "System can insert user progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

### Fields

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| `user_id` | UUID | - | References auth.users(id) |
| `level` | TEXT | Beginner, Explorer, Builder, Guardian | User level |
| `level_progress` | INTEGER | 0-100 | Progress within current level (%) |
| `courses_completed` | INTEGER | >= 0 | Number of completed courses |
| `certificates_earned` | INTEGER | >= 0 | Number of earned certificates |
| `foundation_contribution` | INTEGER | >= 0 | Total donated (USD cents) |
| `owl_rank` | TEXT | Worker, Academic, Diplomat, Peacekeeper, Warrior | Owl rank |
| `age_group` | TEXT | child, teen, adult | Age group |
| `guardian_status` | TEXT | pending, approved, expired, null | Guardian consent status |
| `created_at` | TIMESTAMPTZ | - | Account creation |
| `updated_at` | TIMESTAMPTZ | - | Last update |

### Level System

```typescript
const LEVELS = {
  Beginner: { min: 0, max: 100, aoiStyle: 'soft, empathetic' },
  Explorer: { min: 0, max: 100, aoiStyle: 'confident, curious' },
  Builder: { min: 0, max: 100, aoiStyle: 'mature, technical' },
  Guardian: { min: 0, max: 100, aoiStyle: 'composed, authoritative' }
};
```

### Owl Ranks

```typescript
const OWL_RANKS = {
  Worker: 'Starting your journey',
  Academic: 'Learning and growing',
  Diplomat: 'Connecting communities',
  Peacekeeper: 'Supporting the mission',
  Warrior: 'Leading the way'
};
```

---

## Interaction Logging

### Table: `aoi_interactions`

**Purpose**: Log all aOi interactions for safety audits and improvement.

**Schema**:
```sql
CREATE TABLE aoi_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  interaction_type TEXT NOT NULL,
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  platform TEXT NOT NULL,
  query_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_interactions_user ON aoi_interactions(user_id);
CREATE INDEX idx_interactions_type ON aoi_interactions(interaction_type);
CREATE INDEX idx_interactions_platform ON aoi_interactions(platform);
CREATE INDEX idx_interactions_created ON aoi_interactions(created_at DESC);

-- RLS
ALTER TABLE aoi_interactions ENABLE ROW LEVEL SECURITY;

-- Users can read their own interactions
CREATE POLICY "Users can read own interactions"
  ON aoi_interactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can insert interactions
CREATE POLICY "Service can insert interactions"
  ON aoi_interactions FOR INSERT
  TO service_role
  WITH CHECK (true);
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | User who asked (nullable for anonymous) |
| `interaction_type` | TEXT | 'medical', 'web3', 'progress', 'general' |
| `question` | TEXT | User's question |
| `response` | TEXT | aOi's response |
| `platform` | TEXT | 'app' or 'foundation' |
| `query_metadata` | JSONB | Additional context (user level, domain, etc.) |
| `created_at` | TIMESTAMPTZ | Timestamp |

### Retention Policy

- Keep all interactions for 90 days
- Aggregate statistics monthly
- Delete PII after 90 days
- Keep anonymized metrics indefinitely

---

## Guardian Consents

### Table: `guardian_consents`

**Purpose**: Track parental/guardian consent for minors.

**Schema**:
```sql
CREATE TABLE guardian_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guardian_email TEXT NOT NULL,
  guardian_name TEXT NOT NULL,
  consent_given BOOLEAN DEFAULT false,
  consent_date TIMESTAMPTZ,
  expiration_date TIMESTAMPTZ,
  consent_type TEXT DEFAULT 'educational',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_consents_user ON guardian_consents(user_id);
CREATE INDEX idx_consents_status ON guardian_consents(consent_given);
CREATE INDEX idx_consents_expiration ON guardian_consents(expiration_date);

-- RLS
ALTER TABLE guardian_consents ENABLE ROW LEVEL SECURITY;

-- Users can read their own consents
CREATE POLICY "Users can read own consents"
  ON guardian_consents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- System can manage consents
CREATE POLICY "System can manage consents"
  ON guardian_consents FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Child/teen user ID |
| `guardian_email` | TEXT | Guardian's email |
| `guardian_name` | TEXT | Guardian's name |
| `consent_given` | BOOLEAN | Consent status |
| `consent_date` | TIMESTAMPTZ | When consent was given |
| `expiration_date` | TIMESTAMPTZ | When consent expires (1 year) |
| `consent_type` | TEXT | 'educational', 'full' |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update |

### Consent Types

```typescript
const CONSENT_TYPES = {
  educational: {
    allows: ['Academy', 'Knowledge Hub', 'Progress Tracking'],
    restricts: ['NFT Mining', 'Donations', 'Financial Tools']
  },
  full: {
    allows: ['All features (when user turns 18)'],
    requires: ['Age verification', 'Additional guardian consent']
  }
};
```

---

## Content Guidelines

### Medical Content (CNS)

**Approved Sources Only**:
- PubMed / NIH / WHO publications
- Peer-reviewed journals
- Clinical trial databases (public data)
- TYT Foundation Whitepaper
- Curated pediatric neuro-oncology reviews

**Language**:
- 8th-grade reading level
- No graphic descriptions
- Focus on research challenges
- Explain how technology helps

**Required Elements**:
```markdown
## Topic Title

[Educational content]

### Key Facts
- Bullet points
- Simple statistics

⚠️ Important: This is educational information only.
Always consult with qualified medical professionals for
diagnosis, treatment, or medical advice.

**Source**: [Citation with link]
**Last Reviewed**: [Date]
```

### Web3 Content

**Start Simple**:
- What is this?
- Why does it matter?
- Real-world analogy

**Build Up**:
- How does it work?
- Example use case
- TYT ecosystem connection

**Include**:
- Code examples (when relevant)
- Visual descriptions
- Link to Academy courses

**Disclaimers**:
```markdown
**Note**: This is educational content about technology.
Not financial advice. Always do your own research (DYOR).
```

---

## Data Management

### Inserting Medical Knowledge

```sql
INSERT INTO knowledge_base_cns (
  topic,
  content,
  source_citation,
  age_appropriate,
  safety_level,
  keywords,
  last_reviewed
) VALUES (
  'Understanding Medulloblastoma',
  'Medulloblastoma is...',
  'https://pubmed.ncbi.nlm.nih.gov/...',
  true,
  'public',
  ARRAY['medulloblastoma', 'pediatric', 'brain tumor'],
  NOW()
);
```

### Inserting Web3 Knowledge

```sql
INSERT INTO knowledge_base_web3 (
  topic,
  content,
  practical_example,
  difficulty_level,
  related_courses,
  keywords
) VALUES (
  'Blockchain Fundamentals',
  'A blockchain is a distributed ledger...',
  'const block = { ... };',
  'beginner',
  ARRAY['blockchain-101', 'web3-intro'],
  ARRAY['blockchain', 'decentralized', 'ledger']
);
```

### Querying Knowledge

```sql
-- Search medical knowledge
SELECT * FROM knowledge_base_cns
WHERE
  age_appropriate = true
  AND (
    topic ILIKE '%medulloblastoma%'
    OR content ILIKE '%medulloblastoma%'
    OR 'medulloblastoma' = ANY(keywords)
  )
LIMIT 5;

-- Search Web3 knowledge by level
SELECT * FROM knowledge_base_web3
WHERE difficulty_level = 'beginner'
ORDER BY created_at DESC
LIMIT 10;
```

### Tracking User Progress

```sql
-- Update user progress
UPDATE user_progress
SET
  level_progress = 85,
  courses_completed = courses_completed + 1,
  updated_at = NOW()
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

-- Get user progress
SELECT
  p.*,
  u.email
FROM user_progress p
JOIN auth.users u ON u.id = p.user_id
WHERE p.user_id = '550e8400-e29b-41d4-a716-446655440000';
```

### Logging Interactions

```sql
-- Log aOi interaction
INSERT INTO aoi_interactions (
  user_id,
  interaction_type,
  question,
  response,
  platform,
  query_metadata
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'medical',
  'What is medulloblastoma?',
  'Based on educational medical research...',
  'app',
  '{"userLevel": "beginner", "domain": "app"}'::JSONB
);
```

---

## Migration Checklist

- [ ] Create `knowledge_base_cns` table
- [ ] Create `knowledge_base_web3` table
- [ ] Create `user_progress` table
- [ ] Create `aoi_interactions` table
- [ ] Create `guardian_consents` table
- [ ] Enable RLS on all tables
- [ ] Create RLS policies
- [ ] Create indexes
- [ ] Populate sample medical content
- [ ] Populate sample Web3 content
- [ ] Test queries
- [ ] Verify RLS policies
- [ ] Set up automated backups

---

**Last Updated**: 2025-12-28
**Schema Version**: 1.0.0
**Maintained By**: TYT Development Team
