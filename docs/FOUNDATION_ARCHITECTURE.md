# TYT Foundation Architecture
## Архитектура фонда TYT Foundation

> **Last Updated**: January 11, 2026
> **Domain**: tyt.foundation (currently integrated within takeyourtoken.app)
> **Status**: Development Phase - Foundation Module Implemented

---

## Overview / Обзор

TYT Foundation - это некоммерческая организация, посвящённая исследованию опухолей мозга у детей (особенно медуллобластомы). Фонд полностью интегрирован с экосистемой takeyourtoken.app через:

- **aOi (葵)** - AI-куратор и навигатор между доменами
- **Общая база данных** - Supabase с RLS
- **Единая навигация** - бесшовные переходы между разделами
- **Cross-domain API** - для обмена данными

---

## Core Mission / Основная миссия

### English
TYT Foundation is dedicated to:
- Funding breakthrough research in pediatric brain tumors
- Supporting families affected by CNS tumors
- Advancing AI, quantum computing, and Web3 technologies for medical research
- Ensuring 100% transparency through blockchain verification

### Русский
Фонд TYT посвящён:
- Финансированию прорывных исследований опухолей мозга у детей
- Поддержке семей, затронутых опухолями ЦНС
- Продвижению AI, квантовых вычислений и Web3 для медицинских исследований
- Обеспечению 100% прозрачности через верификацию на блокчейне

---

## Architecture Components / Компоненты архитектуры

### 1. Foundation Pages / Страницы фонда

#### **FoundationPage** (`src/pages/FoundationPage.tsx`)
Main landing page with tabs:
- **About** - Mission, statistics, donation widget
- **Research** - Focus areas, research papers
- **Manifesto** - I-QCC research manifesto (authored by aOi)
- **Updates** - News and progress reports

#### **GrantsPage** (`src/pages/GrantsPage.tsx`)
Research grants management:
- Active grants display with filtering
- Grant statistics (total funding, active grants, completed grants)
- Research collaborations showcase
- Partner institutions

#### **TransparencyPage** (`src/pages/TransparencyPage.tsx`)
Financial transparency dashboard:
- Real-time transaction log
- Blockchain verification links
- Fund flow visualization
- Foundation statistics

---

### 2. Database Schema / Схема базы данных

#### Tables used by Foundation:

```sql
-- Foundation Statistics
foundation_statistics
  - total_donated: numeric
  - families_supported: integer
  - research_grants: integer
  - clinical_trials: integer
  - partner_hospitals: integer

-- Research Grants
foundation_grants
  - title: text
  - description_en, description_ru: text
  - amount_usd: numeric
  - institution: text
  - status: enum (proposed, active, completed, paused)
  - started_at, completed_at: timestamptz

-- Transparency Log
fund_transparency
  - transaction_type: enum (donation, allocation, grant, report)
  - amount_usd: numeric
  - source, destination: text
  - blockchain_hash: text
  - is_public: boolean

-- Research Collaborations
research_collaborations
  - name: text
  - type: text
  - status: text
  - description_en, description_ru: text
  - website: text

-- Research Posts (Manifesto, Papers)
research_posts
  - slug: text
  - title_en, title_ru, title_he: text
  - content_en, content_ru, content_he: text
  - post_type: enum (manifesto, research, update)
  - featured: boolean

-- Contact Management
contact_submissions
  - submission_type: enum
  - sender_name, sender_email: text
  - subject, message: text
  - status: enum (new, in_review, resolved)
  - assigned_to: uuid (admin_users)

-- Foundation Contact Info
foundation_contact_info
  - primary_email, support_email: text
  - social media links
  - legal entity details
```

---

### 3. aOi Integration / Интеграция с aOi

aOi служит **мостом между Foundation и App**, предоставляя:

#### Knowledge Domains:
- **CNS Knowledge** (`knowledge_base_cns`) - 24 статьи о медицинских исследованиях
- **Web3 Knowledge** (`knowledge_base_web3`) - 15 статей о блокчейне и крипто
- **Academy Lessons** (`lessons`) - 16 уроков по 4 трекам

#### RAG Query Function:
`aoi-rag-query` Edge Function:
- Semantic search через OpenAI embeddings (text-embedding-3-small)
- Vector similarity search (pgvector + HNSW indexes)
- Context-aware responses based on domain (foundation vs app)
- Multi-language support (EN, RU, HE)

#### Query Types:
```typescript
- medical: CNS knowledge base
- web3: Blockchain/crypto knowledge
- academy: Lessons and courses
- progress: User progress tracking
- general: Navigation and help
```

---

### 4. Navigation Flow / Навигационный поток

```
┌─────────────────────────────────────────┐
│         takeyourtoken.app               │
│  (Single Page App with routing)         │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────┐  ┌──────────────┐       │
│  │   Home    │  │   Academy    │       │
│  │  (Hero)   │  │  (Lessons)   │       │
│  └───────────┘  └──────────────┘       │
│                                         │
│  ┌────────── FOUNDATION ──────────┐    │
│  │                                │    │
│  │  • About                       │    │
│  │  • Grants        ← NEW         │    │
│  │  • Transparency  ← NEW         │    │
│  │  • Contact                     │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────── aOi Assistant ──────┐     │
│  │  Connects Foundation + App     │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

**Key Integration Points:**

1. **Shared Navigation**: `Navigation` component handles all pages
2. **aOi Button**: Available on all pages, context-aware
3. **Cross-references**: Foundation pages link to Academy, vice versa
4. **Unified User Progress**: Single user tracking across domains

---

### 5. Component Structure / Структура компонентов

```
src/
├── pages/
│   ├── HomePage.tsx              # Landing with hero
│   ├── FoundationPage.tsx        # Foundation main (tabs)
│   ├── GrantsPage.tsx           # ← NEW: Grants management
│   ├── TransparencyPage.tsx     # ← NEW: Financial transparency
│   ├── AcademyPage.tsx          # Academy courses
│   └── ContactPage.tsx          # Contact form
│
├── components/
│   ├── AoiAssistant.tsx         # Main aOi chat interface
│   ├── AoiAvatar.tsx            # aOi visual representation
│   ├── AoiCharacter.tsx         # Character variations
│   ├── FoundationStats.tsx      # Foundation statistics widget
│   ├── DonationWidget.tsx       # Donation interface
│   ├── Navigation.tsx           # Main navigation bar
│   └── CrossDomainBridge.tsx    # Domain communication
│
├── services/
│   ├── foundationApi.ts         # Foundation API calls
│   ├── knowledgeService.ts      # aOi knowledge retrieval
│   └── crossDomainApi.ts        # Cross-domain communication
│
└── contexts/
    ├── LanguageContext.tsx      # Multi-language (EN/RU/HE)
    ├── ThemeContext.tsx         # Dark/light theme
    └── UserProgressContext.tsx  # Unified progress tracking
```

---

## Data Flow / Поток данных

### User Journey Example:

```
1. User arrives at tyt.foundation
   ↓
2. Views Foundation page with stats
   ↓
3. Clicks "View Grants" → GrantsPage
   ↓
4. Reviews research grants and collaborations
   ↓
5. Clicks "Transparency" → TransparencyPage
   ↓
6. Verifies blockchain transactions
   ↓
7. Clicks aOi button
   ↓
8. Asks: "How can I learn about Web3?"
   ↓
9. aOi responds with Web3 knowledge + suggests Academy
   ↓
10. User clicks Academy link
    ↓
11. Completes courses, progress tracked
    ↓
12. Returns to Foundation to donate
```

---

## Transparency Mechanisms / Механизмы прозрачности

### 1. Blockchain Verification
- All major transactions recorded on-chain
- Public blockchain_hash for each transaction
- Links to Etherscan for verification

### 2. Real-time Updates
- `fund_transparency` table updated immediately
- Public API endpoint for transparency data
- Automatic statistics calculation

### 3. Open Reporting
- Quarterly transparency reports
- Foundation statistics publicly visible
- Grant allocation decisions transparent

---

## Security & Privacy / Безопасность и приватность

### Row Level Security (RLS):
```sql
-- All foundation tables have RLS enabled
-- Public read access for transparency data
-- Authenticated write access for admins only
```

### Privacy Considerations:
- Patient data NEVER stored in foundation tables
- Blockchain addresses pseudonymous
- Personal donor information protected
- Only aggregated statistics public

---

## Integration with takeyourtoken.app

### Shared Resources:
1. **Database**: Single Supabase instance
2. **Authentication**: Unified auth system
3. **Progress Tracking**: Cross-domain progress ledger
4. **aOi Knowledge**: Accessible from both domains

### Domain Separation:
- Foundation: Research, grants, transparency, medical knowledge
- App: Academy, courses, tokens, user dashboard
- aOi: Context-aware responses based on current domain

### API Endpoints:

```typescript
// Foundation API
GET  /api/foundation/stats
GET  /api/foundation/grants
GET  /api/foundation/transparency
POST /api/foundation/donate

// Cross-domain
GET  /api/knowledge/search?domain=foundation
POST /api/aoi/query
```

---

## Roadmap / Дорожная карта

### Phase 1: Foundation Core ✅ COMPLETED
- [x] Foundation pages (About, Grants, Transparency)
- [x] Database schema and RLS
- [x] Demo data population
- [x] Navigation integration

### Phase 2: aOi Enhancement (Current)
- [x] RAG system with vector search
- [x] Knowledge base population (24 CNS + 15 Web3)
- [x] Multi-language support
- [ ] Generate embeddings for existing content

### Phase 3: Advanced Features
- [ ] Donation widget with crypto support
- [ ] Impact reports generation
- [ ] Clinical partners showcase
- [ ] Real blockchain integration
- [ ] DAO governance for grant allocation

### Phase 4: Deployment
- [ ] Separate domain deployment (tyt.foundation)
- [ ] Cross-domain cookie sharing
- [ ] CDN optimization
- [ ] Production monitoring

---

## Technical Specifications

### Frontend:
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: React Context API

### Backend:
- **Database**: Supabase (PostgreSQL + Row Level Security)
- **Vector Search**: pgvector with HNSW indexes
- **Edge Functions**: Deno (TypeScript)
- **AI**: OpenAI API (text-embedding-3-small)

### Infrastructure:
- **Hosting**: TBD (Vercel/Netlify recommended)
- **Database**: Supabase Cloud
- **CDN**: Cloudflare
- **Monitoring**: Sentry + Supabase Analytics

---

## aOi Character Design

### Visual Identity:
- **Name**: aOi (葵) - "soft + tech + academic"
- **Age appearance**: Adaptive (16-25 based on user level)
- **Style**: Modern anime, minimalist, professional
- **Colors**: Lavender, soft blue, white
- **Emotion states**: neutral, happy, thinking, excited

### Adaptive Behavior:
```
Beginner (10-14):
  - Softer features, maximum empathy
  - Simple language, encouraging tone
  - Visual: beginner-neutral.png

Explorer (14-18):
  - More confident posture
  - Technical concepts introduced gradually
  - Visual: explorer-thinking.png

Builder (18-25):
  - Professional demeanor
  - Complex topics explained clearly
  - Visual: builder-excited.png

Guardian (25+):
  - Maximum responsibility
  - Systemic oversight and security focus
  - Visual: guardian-neutral.png
```

---

## Key Differentiators / Ключевые отличия

### What makes TYT Foundation unique:

1. **Web3-Native Transparency**
   - Every transaction on blockchain
   - Public verification
   - Real-time updates

2. **AI-Curated Knowledge**
   - aOi as infrastructure layer
   - RAG for accurate responses
   - Multi-domain expertise

3. **Educational Integration**
   - Learn Web3 → Support research
   - Progress tracking → Portfolio building
   - Community governance

4. **Quantum Computing Focus**
   - I-QCC collaboration
   - Drug discovery applications
   - Cutting-edge research

5. **DeSci Pioneer**
   - Decentralized science principles
   - Open data sharing
   - Transparent funding

---

## Contact & Support / Контакты и поддержка

### For Developers:
- Repository: (TBD)
- Documentation: This file
- Issues: (TBD)

### For Foundation:
- Website: tyt.foundation (currently takeyourtoken.app)
- Email: foundation@takeyourtoken.app
- Support: Via contact form

### For Researchers:
- Grants: grants@takeyourtoken.app
- Collaborations: partnerships@takeyourtoken.app

---

## Conclusion / Заключение

TYT Foundation представляет собой новый подход к медицинским исследованиям, объединяя:
- **Transparency** через blockchain
- **Education** через Academy
- **AI** через aOi
- **Community** через DAO

Это не просто фонд - это экосистема, где наука, технологии и сообщество работают вместе для спасения детских жизней.

---

**Built with ❤️ by the TYT Team**
**Guided by aOi (葵)**
