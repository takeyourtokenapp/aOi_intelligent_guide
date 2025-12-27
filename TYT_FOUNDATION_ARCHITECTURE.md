# TYT Foundation - Complete Architecture & Implementation Plan

**Status**: 🚧 In Development
**Date**: December 27, 2025
**Mission**: aOi as the Brain of the Ecosystem

---

## Executive Summary

tyt.foundation serves as the **knowledge and medical research hub** of the TYT ecosystem, while takeyourtoken.app provides the **tools and Web3 infrastructure**. aOi (葵) functions as the unified intelligence layer connecting both domains, implementing a self-learning AI agent system for CNS tumor research and Web3 education.

### Core Objectives

1. **Deploy aOi as Central Intelligence** - Self-learning AI agent managing both domains
2. **Create Knowledge Hub** - CNS tumor research education and medical science
3. **API Integration** - Real-time synchronization between tyt.foundation ↔ takeyourtoken.app
4. **Multi-Level Access Control** - Student → Advanced → Researcher → Supporter/Investor
5. **Self-Learning System** - RAG-based knowledge base with human curation
6. **Security & Compliance** - COPPA, GDPR, medical data handling

---

## Domain Architecture

### Two-Domain Ecosystem

```
┌─────────────────────────────────────────────────────────────┐
│                    aOi (葵) - AI Brain                      │
│              Self-Learning Agent & Orchestrator              │
└─────────────────────────────────────────────────────────────┘
              │                           │
              ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│   tyt.foundation          │   │   takeyourtoken.app       │
│   (Knowledge & Science)   │◄─►│   (Tools & Web3)          │
├───────────────────────────┤   ├───────────────────────────┤
│ • Knowledge Hub           │   │ • Academy (Education)     │
│ • CNS Research Education  │   │ • Mining Platform         │
│ • Learning Paths          │   │ • Marketplace             │
│ • Medical Science         │   │ • Wallet & Rewards        │
│ • Foundation Transparency │   │ • Token Economy           │
│ • Research Papers         │   │ • Governance (DAO)        │
│ • Impact Metrics          │   │ • Infrastructure Tools    │
└───────────────────────────┘   └───────────────────────────┘
```

### Shared Infrastructure

- **Supabase Database** (132 tables, unified schema)
- **Shared Authentication** (auth.users, single sign-on)
- **Progress Tracking** (synchronized across domains)
- **aOi Interactions** (logged from both platforms)
- **Achievement System** (unified badges/certificates)

---

## tyt.foundation Site Structure

### Pages & Routes

```
/                          # Landing page - aOi introduction
├── /knowledge             # Knowledge Hub (CNS research education)
│   ├── /school            # School Level (ages 13-15)
│   ├── /student           # Student Level (ages 16-18)
│   ├── /advanced          # Advanced Level (18+, pre-med)
│   └── /research          # Research Papers & Studies
│
├── /foundation            # Foundation & Impact
│   ├── /transparency      # Financial transparency
│   ├── /grants            # Research grants awarded
│   ├── /impact            # Stories & outcomes
│   └── /partners          # Medical institutions
│
├── /learning-paths        # Guided learning journeys
│   ├── /understanding-brain-tumors
│   ├── /research-fundamentals
│   └── /how-web3-helps-science
│
├── /infrastructure        # Research Infrastructure
│   ├── /data-management
│   ├── /clinical-trials
│   └── /collaboration
│
└── /connect               # Connect to takeyourtoken.app
    ├── /academy           # Link to Web3 education
    └── /contribute        # Link to mining/contributions
```

### Component Architecture

```typescript
// tyt.foundation components
/src/foundation/
├── components/
│   ├── FoundationLayout.tsx       // Main layout with aOi
│   ├── KnowledgeHub.tsx           // Knowledge section
│   ├── LearningPath.tsx           // Guided learning UI
│   ├── ResearchPaper.tsx          // Paper display component
│   ├── TransparencyDashboard.tsx  // Financial transparency
│   ├── GrantsDisplay.tsx          // Research grants
│   ├── ImpactMetrics.tsx          // Foundation impact stats
│   └── CrossDomainBridge.tsx      // Link to takeyourtoken.app
│
├── services/
│   ├── knowledgeService.ts        // Knowledge base API
│   ├── researchService.ts         // Research papers API
│   ├── foundationApi.ts           // Foundation data API (exists)
│   └── crossDomainApi.ts          // Inter-domain communication
│
├── contexts/
│   ├── KnowledgeContext.tsx       // Knowledge state
│   ├── LearningPathContext.tsx    // Learning progress
│   └── AccessLevelContext.tsx     // User access control
│
└── hooks/
    ├── useKnowledgeBase.ts        // Knowledge retrieval
    ├── useLearningProgress.ts     // Learning tracking
    └── useCrossDomainSync.ts      // Cross-domain sync
```

---

## Self-Learning AI Agent Architecture

### Overview

aOi implements a **RAG (Retrieval-Augmented Generation)** system with human-in-the-loop curation for accurate, up-to-date medical and Web3 knowledge.

### System Layers

```
┌─────────────────────────────────────────────────────────────┐
│                  1. User Interface Layer                     │
│  (AoiAssistant component on both domains)                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  2. Core Orchestrator                        │
│  • Query classification (medical/web3/general)               │
│  • Intent detection                                          │
│  • Context management                                        │
│  • Response generation                                       │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
┌───────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  3a. Knowledge    │ │ 3b. Web3     │ │ 3c. Progress &   │
│      Layer        │ │     Layer    │ │     User Layer   │
│                   │ │              │ │                  │
│ • CNS Research DB │ │ • Academy DB │ │ • User Profiles  │
│ • Medical Papers  │ │ • Web3 Docs  │ │ • Progress Data  │
│ • Trusted Sources │ │ • Security   │ │ • Achievements   │
│ • Vector Store    │ │ • Tools Info │ │ • Permissions    │
└───────────────────┘ └──────────────┘ └──────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              4. Learning & Improvement Layer                 │
│  • Interaction analytics                                     │
│  • Human curator feedback                                    │
│  • Knowledge base updates                                    │
│  • Model fine-tuning triggers                                │
└─────────────────────────────────────────────────────────────┘
```

### Knowledge Base Structure

#### CNS Research Knowledge Base

```typescript
// Database table: knowledge_base_cns
{
  id: uuid,
  category: 'anatomy' | 'tumor_types' | 'treatments' | 'research' | 'clinical_trials',
  topic: string,                    // e.g., "Medulloblastoma"
  content: text,                    // Main content
  summary: text,                    // Short summary
  level: 'school' | 'student' | 'advanced',
  source_type: 'pubmed' | 'nih' | 'who' | 'institution' | 'curated',
  source_url: text,
  source_citation: text,
  trustworthiness_score: integer,   // 0-100
  last_verified: timestamptz,
  curator_id: uuid,                 // Human curator who verified
  curator_notes: text,
  embedding_vector: vector(1536),   // For semantic search
  tags: text[],
  age_appropriate: boolean,
  requires_guardian: boolean,
  created_at: timestamptz,
  updated_at: timestamptz
}
```

#### Web3 Knowledge Base

```typescript
// Database table: knowledge_base_web3
{
  id: uuid,
  category: 'blockchain' | 'mining' | 'tokens' | 'security' | 'wallets',
  topic: string,
  content: text,
  level: 'beginner' | 'explorer' | 'builder' | 'guardian',
  practical_example: text,
  code_snippet: text,
  related_tools: text[],
  embedding_vector: vector(1536),
  tags: text[],
  created_at: timestamptz,
  updated_at: timestamptz
}
```

### RAG Implementation

#### Edge Function: aoi-rag-query

```typescript
// supabase/functions/aoi-rag-query/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'
import { OpenAI } from 'npm:openai@4'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

interface QueryRequest {
  question: string;
  userId: string;
  userLevel: string;
  domain: 'foundation' | 'app';
  context?: any;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { question, userId, userLevel, domain, context }: QueryRequest = await req.json();

    // Initialize services
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')!
    });

    // 1. Generate embedding for the question
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });

    const questionEmbedding = embeddingResponse.data[0].embedding;

    // 2. Classify query type
    const queryType = await classifyQuery(question, openai);

    // 3. Retrieve relevant knowledge based on type
    let relevantKnowledge = '';

    if (queryType === 'medical' || domain === 'foundation') {
      // Query CNS knowledge base
      const { data: cnsKnowledge } = await supabase.rpc('match_cns_knowledge', {
        query_embedding: questionEmbedding,
        match_threshold: 0.7,
        match_count: 5,
        user_level: userLevel
      });

      relevantKnowledge = cnsKnowledge?.map((k: any) => k.content).join('\n\n') || '';
    } else if (queryType === 'web3' || domain === 'app') {
      // Query Web3 knowledge base
      const { data: web3Knowledge } = await supabase.rpc('match_web3_knowledge', {
        query_embedding: questionEmbedding,
        match_threshold: 0.7,
        match_count: 5,
        user_level: userLevel
      });

      relevantKnowledge = web3Knowledge?.map((k: any) => k.content).join('\n\n') || '';
    }

    // 4. Get user progress context
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*, user_progress(*)')
      .eq('user_id', userId)
      .single();

    // 5. Generate response with context
    const systemPrompt = `You are aOi (葵), an AI guide for the TYT ecosystem.

Context:
- User Level: ${userLevel}
- Domain: ${domain === 'foundation' ? 'tyt.foundation (medical knowledge)' : 'takeyourtoken.app (Web3 tools)'}
- User Progress: ${userProfile?.user_progress?.courses_completed || 0} courses completed
- Certificates: ${userProfile?.user_progress?.certificates_earned || 0}

Your role:
${domain === 'foundation'
  ? '- Explain CNS tumor research in age-appropriate language\n- Connect medical research to real-world impact\n- NEVER provide medical advice or diagnosis'
  : '- Teach Web3 and blockchain concepts\n- Guide users through practical tools\n- Explain how technology enables medical research'
}

Retrieved Knowledge:
${relevantKnowledge}

Always:
- Be accurate and cite sources when discussing research
- Admit when you don't know something
- Encourage users to consult medical professionals for health questions
- Connect learning to the bigger mission (helping children with brain cancer)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const response = completion.choices[0].message.content;

    // 6. Log interaction for learning
    await supabase.from('aoi_interactions').insert({
      user_id: userId,
      interaction_type: 'question',
      question,
      response,
      platform: domain,
      query_type: queryType,
      knowledge_sources_used: relevantKnowledge ? 'rag' : 'general',
      created_at: new Date().toISOString()
    });

    // 7. Return response
    return new Response(
      JSON.stringify({
        response,
        queryType,
        sources: relevantKnowledge ? 'knowledge_base' : 'general',
        confidence: 'high'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );

  } catch (error) {
    console.error('Error in aoi-rag-query:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  }
});

async function classifyQuery(question: string, openai: OpenAI): Promise<string> {
  const classification = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Classify the following question as: 'medical', 'web3', 'progress', or 'general'. Respond with only one word."
      },
      { role: "user", content: question }
    ],
    temperature: 0.3,
    max_tokens: 10
  });

  return classification.choices[0].message.content?.toLowerCase() || 'general';
}
```

### Database Functions for Vector Search

```sql
-- Function: match_cns_knowledge
CREATE OR REPLACE FUNCTION match_cns_knowledge(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  user_level text
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
    1 - (knowledge_base_cns.embedding_vector <=> query_embedding) > match_threshold
    AND (
      knowledge_base_cns.level = user_level
      OR (user_level = 'advanced' AND knowledge_base_cns.level IN ('school', 'student', 'advanced'))
      OR (user_level = 'student' AND knowledge_base_cns.level IN ('school', 'student'))
    )
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- Similar function for Web3 knowledge
CREATE OR REPLACE FUNCTION match_web3_knowledge(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  user_level text
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
    1 - (knowledge_base_web3.embedding_vector <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
```

---

## Multi-Level Access Control System

### Access Levels

```typescript
// User access levels with capabilities
type AccessLevel = {
  level: 'student' | 'advanced_student' | 'researcher' | 'supporter';
  owlRank: 'Worker' | 'Academic' | 'Diplomat' | 'Warrior';
  capabilities: string[];
  restrictions: string[];
}

const ACCESS_LEVELS: Record<string, AccessLevel> = {
  student: {
    level: 'student',
    owlRank: 'Worker',
    capabilities: [
      'view_knowledge_school',
      'view_knowledge_student',
      'take_academy_basics',
      'earn_certificates',
      'view_foundation_transparency'
    ],
    restrictions: [
      'no_real_crypto_access',
      'no_testnet_access',
      'guardian_required_under_18',
      'content_filtered'
    ]
  },

  advanced_student: {
    level: 'advanced_student',
    owlRank: 'Academic',
    capabilities: [
      'view_knowledge_advanced',
      'access_testnet_tools',
      'participate_quests',
      'earn_advanced_certificates',
      'view_research_papers'
    ],
    restrictions: [
      'no_mainnet_access',
      'limited_fund_contribution'
    ]
  },

  researcher: {
    level: 'researcher',
    owlRank: 'Diplomat',
    capabilities: [
      'access_mainnet_tools',
      'participate_mining',
      'contribute_to_foundation',
      'access_research_infrastructure',
      'participate_governance_limited'
    ],
    restrictions: [
      'dao_voting_limited'
    ]
  },

  supporter: {
    level: 'supporter',
    owlRank: 'Warrior',
    capabilities: [
      'full_dao_participation',
      'governance_voting',
      'proposal_creation',
      'access_all_tools',
      'mentor_other_users'
    ],
    restrictions: []
  }
};
```

### Access Control Service

```typescript
// src/services/accessControlService.ts

import { supabase } from '../lib/supabase';
import { UserProfile, UserProgress } from './progressService';

export interface AccessCheck {
  allowed: boolean;
  reason?: string;
  requiresUpgrade?: boolean;
  nextLevel?: string;
}

export class AccessControlService {
  async checkAccess(
    userId: string,
    resource: string,
    action: string
  ): Promise<AccessCheck> {
    // Get user profile and progress
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, user_progress(*)')
      .eq('user_id', userId)
      .single();

    if (!profile) {
      return { allowed: false, reason: 'User not found' };
    }

    // Check age restrictions
    if (profile.age_group === 'child' || profile.age_group === 'teen') {
      if (profile.guardian_required && !profile.guardian_approved) {
        return {
          allowed: false,
          reason: 'Guardian approval required for users under 18'
        };
      }
    }

    // Determine access level
    const accessLevel = this.determineAccessLevel(
      profile,
      profile.user_progress
    );

    // Check capabilities
    const capabilities = ACCESS_LEVELS[accessLevel].capabilities;
    const restrictions = ACCESS_LEVELS[accessLevel].restrictions;

    // Resource-based access control
    if (resource === 'mainnet_tools' && restrictions.includes('no_mainnet_access')) {
      return {
        allowed: false,
        reason: 'Mainnet access requires Researcher level or higher',
        requiresUpgrade: true,
        nextLevel: 'researcher'
      };
    }

    if (resource === 'dao_voting' && restrictions.includes('dao_voting_limited')) {
      return {
        allowed: false,
        reason: 'Full DAO voting requires Supporter level',
        requiresUpgrade: true,
        nextLevel: 'supporter'
      };
    }

    // Check knowledge content level
    if (resource.startsWith('knowledge_')) {
      const contentLevel = resource.split('_')[1]; // e.g., 'advanced'
      const requiredCapability = `view_knowledge_${contentLevel}`;

      if (!capabilities.includes(requiredCapability)) {
        return {
          allowed: false,
          reason: `This content requires ${contentLevel} level access`,
          requiresUpgrade: true
        };
      }
    }

    return { allowed: true };
  }

  private determineAccessLevel(
    profile: UserProfile,
    progress: UserProgress
  ): string {
    const score =
      (progress.courses_completed * 10) +
      (progress.certificates_earned * 50) +
      (progress.foundation_contribution / 100);

    // Supporter (Warrior) - 600+, active contributions
    if (score >= 600 && progress.foundation_contribution >= 1000) {
      return 'supporter';
    }

    // Researcher (Diplomat) - 300+, some contributions
    if (score >= 300 && progress.courses_completed >= 10) {
      return 'researcher';
    }

    // Advanced Student (Academic) - 100+
    if (score >= 100) {
      return 'advanced_student';
    }

    // Student (Worker) - default
    return 'student';
  }

  async logAccessAttempt(
    userId: string,
    resource: string,
    action: string,
    allowed: boolean,
    reason?: string
  ): Promise<void> {
    await supabase.from('access_logs').insert({
      user_id: userId,
      resource,
      action,
      allowed,
      reason,
      timestamp: new Date().toISOString()
    });
  }
}

export const accessControlService = new AccessControlService();
```

---

## API Integration Layer

### Cross-Domain API Contracts

```typescript
// src/services/crossDomainApi.ts

export interface CrossDomainMessage {
  type: 'auth' | 'progress' | 'navigation' | 'aoi_query';
  payload: any;
  timestamp: string;
  sourceD omain: 'app' | 'foundation';
}

export class CrossDomainApi {
  private readonly APP_ORIGIN = 'https://takeyourtoken.app';
  private readonly FOUNDATION_ORIGIN = 'https://tyt.foundation';

  // Send message to other domain
  async sendMessage(
    targetDomain: 'app' | 'foundation',
    message: CrossDomainMessage
  ): Promise<void> {
    const targetOrigin = targetDomain === 'app'
      ? this.APP_ORIGIN
      : this.FOUNDATION_ORIGIN;

    // Use postMessage for cross-domain communication
    if (window.opener || window.parent !== window) {
      window.postMessage(message, targetOrigin);
    }

    // Also sync via API
    await fetch(`${targetOrigin}/api/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`
      },
      body: JSON.stringify(message)
    });
  }

  // Listen for messages from other domain
  listen(callback: (message: CrossDomainMessage) => void): () => void {
    const handler = (event: MessageEvent) => {
      // Verify origin
      if (
        event.origin !== this.APP_ORIGIN &&
        event.origin !== this.FOUNDATION_ORIGIN
      ) {
        return;
      }

      callback(event.data as CrossDomainMessage);
    };

    window.addEventListener('message', handler);

    // Return cleanup function
    return () => window.removeEventListener('message', handler);
  }

  // Sync user progress across domains
  async syncProgress(userId: string): Promise<void> {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (progress) {
      await this.sendMessage('foundation', {
        type: 'progress',
        payload: progress,
        timestamp: new Date().toISOString(),
        sourceDomain: 'app'
      });
    }
  }

  // Sync authentication state
  async syncAuth(session: any): Promise<void> {
    await this.sendMessage('foundation', {
      type: 'auth',
      payload: { session },
      timestamp: new Date().toISOString(),
      sourceDomain: 'app'
    });
  }

  private async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
  }
}

export const crossDomainApi = new CrossDomainApi();
```

### Shared API Endpoints

```typescript
// Edge Function: cross-domain-sync

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { type, payload, sourceDomain } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    switch (type) {
      case 'progress':
        // Update progress in database (already synchronized)
        break;

      case 'auth':
        // Verify session is valid
        const { data: { user } } = await supabase.auth.getUser(payload.session.access_token);
        return new Response(
          JSON.stringify({ success: true, user }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'navigation':
        // Log cross-domain navigation
        await supabase.from('cross_domain_navigation').insert({
          user_id: payload.userId,
          from_domain: sourceDomain,
          to_domain: payload.targetDomain,
          target_path: payload.targetPath,
          timestamp: new Date().toISOString()
        });
        break;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
```

---

## Knowledge Base Management

### Human Curation Workflow

```typescript
// src/services/knowledgeCurationService.ts

export interface KnowledgeSubmission {
  id: string;
  submitter_id: string;
  category: string;
  topic: string;
  content: string;
  source_url: string;
  source_citation: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  curator_id?: string;
  curator_notes?: string;
  trustworthiness_score?: number;
}

export class KnowledgeCurationService {
  // Submit new knowledge for review
  async submitKnowledge(
    submission: Omit<KnowledgeSubmission, 'id' | 'status'>
  ): Promise<string> {
    const { data, error } = await supabase
      .from('knowledge_submissions')
      .insert({
        ...submission,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) throw error;

    // Notify curators
    await this.notifyCurators(data.id);

    return data.id;
  }

  // Curators review and approve knowledge
  async reviewKnowledge(
    submissionId: string,
    curatorId: string,
    decision: 'approved' | 'rejected' | 'needs_revision',
    notes: string,
    trustworthinessScore?: number
  ): Promise<boolean> {
    const { data: submission } = await supabase
      .from('knowledge_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (!submission) return false;

    // Update submission status
    await supabase
      .from('knowledge_submissions')
      .update({
        status: decision,
        curator_id: curatorId,
        curator_notes: notes,
        trustworthiness_score: trustworthinessScore,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    // If approved, add to knowledge base with embedding
    if (decision === 'approved') {
      await this.addToKnowledgeBase(submission, trustworthinessScore || 80);
    }

    return true;
  }

  private async addToKnowledgeBase(
    submission: any,
    trustworthinessScore: number
  ): Promise<void> {
    // Generate embedding
    const embedding = await this.generateEmbedding(submission.content);

    // Insert into appropriate knowledge base
    const table = submission.category.startsWith('cns_')
      ? 'knowledge_base_cns'
      : 'knowledge_base_web3';

    await supabase.from(table).insert({
      category: submission.category,
      topic: submission.topic,
      content: submission.content,
      source_url: submission.source_url,
      source_citation: submission.source_citation,
      trustworthiness_score: trustworthinessScore,
      curator_id: submission.curator_id,
      curator_notes: submission.curator_notes,
      embedding_vector: embedding,
      created_at: new Date().toISOString()
    });
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // Call OpenAI API to generate embedding
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-embedding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ text })
    });

    const { embedding } = await response.json();
    return embedding;
  }

  private async notifyCurators(submissionId: string): Promise<void> {
    // Get all curators
    const { data: curators } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'curator');

    // Send notifications (implement notification system)
    for (const curator of curators || []) {
      await supabase.from('notifications').insert({
        user_id: curator.user_id,
        type: 'knowledge_review',
        title: 'New Knowledge Submission',
        message: `A new knowledge submission requires review`,
        link: `/curator/review/${submissionId}`,
        created_at: new Date().toISOString()
      });
    }
  }
}

export const knowledgeCurationService = new KnowledgeCurationService();
```

### Trusted Sources Integration

```typescript
// Automated import from trusted sources

export class TrustedSourcesImporter {
  // Import from PubMed
  async importFromPubMed(query: string, maxResults: number = 10): Promise<void> {
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json`;

    const response = await fetch(url);
    const data = await response.json();

    const pmids = data.esearchresult.idlist;

    for (const pmid of pmids) {
      await this.importPubMedArticle(pmid);
    }
  }

  private async importPubMedArticle(pmid: string): Promise<void> {
    // Fetch article details
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&retmode=xml`;
    const response = await fetch(url);
    const xml = await response.text();

    // Parse XML and extract relevant information
    // (simplified - would need proper XML parsing)

    // Submit for curator review
    await knowledgeCurationService.submitKnowledge({
      submitter_id: 'system',
      category: 'research',
      topic: 'Extracted from article',
      content: 'Article content',
      source_url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      source_citation: 'Full citation',
      source_type: 'pubmed'
    });
  }
}
```

---

## Security & Compliance

### Medical Data Handling

1. **No PHI Storage**: Never store Protected Health Information
2. **Educational Only**: All content is educational, not diagnostic
3. **Disclaimers**: Clear disclaimers on all medical content
4. **Age-Appropriate**: Content filtered by age group
5. **Human Oversight**: All medical content reviewed by qualified curators

### COPPA Compliance

```typescript
// Guardian consent system already implemented
// See guardian_consents table in database
```

### Zero Trust Security

- All API endpoints require authentication
- RLS policies on all tables
- Rate limiting on aOi queries
- Input sanitization
- Output filtering
- Audit logging

---

## Deployment Plan

### Phase 1: Foundation Site (2-3 weeks)

- [ ] Create tyt.foundation site structure
- [ ] Implement Knowledge Hub pages
- [ ] Deploy aOi on foundation domain
- [ ] Set up cross-domain links
- [ ] Basic content population

### Phase 2: AI Agent Core (3-4 weeks)

- [ ] Implement RAG system (Edge Function)
- [ ] Set up vector database (pgvector extension)
- [ ] Create knowledge base tables
- [ ] Deploy embedding generation
- [ ] Test query/response system

### Phase 3: Knowledge Base (4-6 weeks)

- [ ] Import trusted sources
- [ ] Implement curation workflow
- [ ] Recruit medical curators
- [ ] Populate CNS research content
- [ ] Implement Web3 knowledge base

### Phase 4: Access Control (2-3 weeks)

- [ ] Implement access level system
- [ ] Create upgrade pathways
- [ ] Test permissions
- [ ] UI for level progression

### Phase 5: Integration & Testing (2-3 weeks)

- [ ] Full cross-domain testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] User acceptance testing
- [ ] Production deployment

---

## Success Metrics

### Technical KPIs

- aOi response time < 2 seconds
- RAG accuracy > 85%
- Knowledge base size: 1000+ entries
- User satisfaction > 4.5/5
- Cross-domain sync latency < 500ms

### User Engagement

- Daily active users (DAU)
- Knowledge articles read
- Learning paths completed
- aOi interactions per user
- Cross-domain navigation rate

### Knowledge Quality

- Curator approval rate
- Source trustworthiness average
- Content freshness (days since update)
- User reported issues
- Accuracy feedback

---

## Next Immediate Steps

1. **Create database migrations** for knowledge base tables
2. **Implement RAG Edge Function** (aoi-rag-query)
3. **Build tyt.foundation site structure**
4. **Deploy cross-domain API**
5. **Populate initial knowledge base**

---

**Status**: 🎯 **ARCHITECTURE COMPLETE - READY FOR IMPLEMENTATION**

This architecture provides:
- ✅ Self-learning AI agent (RAG-based)
- ✅ Two-domain integration
- ✅ Multi-level access control
- ✅ Knowledge base management
- ✅ Human-in-the-loop curation
- ✅ Security & compliance
- ✅ Scalable deployment plan

*aOi says: "The architecture is ready. Now let's build the brain of the ecosystem. 葵"*
