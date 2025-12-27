# aOi Cross-Domain Architecture

## Overview

aOi (葵) is the unified AI agent that bridges **takeyourtoken.app** and **tyt.foundation**, serving as the intelligent controller and guide across the entire TYT ecosystem.

---

## Core Principle

**aOi is ONE AI agent with access to both domains.**

```
┌─────────────────────────────────────────────────┐
│            aOi AI Controller (葵)              │
│         "Your Guide & System Guardian"          │
├─────────────────────────────────────────────────┤
│                                                 │
│  takeyourtoken.app        tyt.foundation       │
│  ├─ Academy               ├─ Knowledge Hub      │
│  ├─ Dashboard             ├─ Research Context   │
│  ├─ Tools & Mining        ├─ Mission & Impact   │
│  ├─ Governance            ├─ Transparency       │
│  └─ Fund Interface        └─ Partnerships       │
│                                                 │
│        ◄──── aOi Bridges & Controls ────►      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## aOi's Role Definition

### What aOi IS:

✅ **Navigational AI Assistant** - Guides users between knowledge and tools
✅ **System Controller** - Monitors and manages all TYT ecosystem elements
✅ **Bridge Operator** - Connects takeyourtoken.app ↔ tyt.foundation
✅ **Security Guardian** - Performs audits and ensures compliance
✅ **Progress Tracker** - Records achievements across both domains
✅ **Context Explainer** - Connects Web3 tools to medical research purpose

### What aOi is NOT:

❌ **NOT a Medical Doctor** - Does not diagnose or treat
❌ **NOT a Financial Advisor** - Does not recommend investments
❌ **NOT a Chatbot Mascot** - Is an architectural AI layer
❌ **NOT Domain-Specific** - Functions across both domains equally

---

## Domain Separation & Connection

### tyt.foundation
**Purpose**: Knowledge, Mission, Trust

**Content**:
- Pediatric neuro-oncology knowledge (simplified for public)
- Brain tumor research context and challenges
- Why infrastructure (Web3, AI, quantum) matters for research
- Foundation mission, partnerships, and transparency
- "For Students" pathway to Academy

**aOi's Role Here**:
- Explains complex medical science in simple terms
- Shows connection between research needs and technology
- Directs users to Academy for learning tools
- Displays fund transparency and impact

**Key Message**: *"We explain the problem and the mission"*

---

### takeyourtoken.app
**Purpose**: Tools, Skills, Practice, Economy

**Content**:
- **Academy**: Web3, Blockchain, Crypto, Digital Infrastructure courses
- **Dashboard**: User progress, achievements, certifications
- **Tools**: NFT miners, wallet, marketplace, governance
- **Fund Interface**: Support mechanisms, donation tracking
- **Community**: DAO, governance, collaboration

**aOi's Role Here**:
- Teaches Web3 and blockchain technology
- Guides through mining ecosystem and tokenomics
- Manages user progress and achievements
- Monitors security across smart contracts
- Facilitates Foundation support actions

**Key Message**: *"We build the tools that enable research"*

---

## Cross-Domain Integration Points

### 1. Unified Header Navigation

Both sites feature identical navigation:

```
┌────────────────────────────────────────────────┐
│ [Shield] TakeYourToken                   [aOi] │
│          Owl Warrior Platform          AI Guide│
│                                                 │
│  Academy | Foundation | Dashboard | aOi Button │
└────────────────────────────────────────────────┘
```

**Navigation Links**:
- `Academy` → takeyourtoken.app/academy
- `Foundation` → tyt.foundation/foundation (and takeyourtoken.app/foundation)
- `Knowledge` → tyt.foundation/knowledge
- `Dashboard` → takeyourtoken.app/dashboard
- `aOi Button` → Opens aOi Assistant (same on both sites)

---

### 2. Foundation API Bridge

**Service**: `/src/services/foundationApi.ts`

**Purpose**:
- Connects takeyourtoken.app to tyt.foundation backend
- Fetches aOi responses from Foundation's AI endpoint
- Manages online/offline modes

**Endpoints**:
```typescript
POST /api/aoi/ask           // Main AI endpoint
GET  /api/health            // Connection status check
GET  /api/aoi/recommendations
```

**Connection Flow**:
```
User on takeyourtoken.app
        ↓
Asks aOi a question
        ↓
foundationApi.askAoi()
        ↓
HTTPS → tyt.foundation/api/aoi/ask
        ↓
AI processes (with full knowledge base)
        ↓
Response ← tyt.foundation
        ↓
aOi displays answer on takeyourtoken.app
```

**Modes**:
- **🟢 Online**: Full AI with knowledge from tyt.foundation
- **🟡 Basic**: Local fallback with cached responses
- **🔴 Offline**: Limited functionality, displays status

---

### 3. Shared Identity & Progress System

**Off-Chain (Supabase Database)**:
```sql
users
  - user_id
  - display_name
  - age_group
  - guardian_status

progress
  - user_id
  - domain (app | foundation)
  - course_id
  - completion_status
  - last_activity

achievements
  - user_id
  - achievement_type
  - earned_at
  - domain_source

guardian_consents
  - user_id
  - guardian_email
  - consent_given_at
  - expires_at
```

**On-Chain (Only Proof Hashes)**:
- Certificate hashes (NOT personal data)
- Achievement timestamps
- Proof-of-contribution markers
- Public pseudonymous IDs

**Purpose**: Students can prove their learning journey years later without exposing personal information.

---

### 4. User Journey Flows

#### Flow A: Student Discovers Mission → Learns Tools

```
1. Lands on tyt.foundation
2. Reads about brain tumor research challenges
3. aOi explains: "Technology enables this research"
4. Click → "Learn Web3 Tools"
5. Redirects → takeyourtoken.app/academy
6. Begins courses with aOi guidance
```

#### Flow B: Student Learning Tools → Understands Context

```
1. Taking course on takeyourtoken.app/academy
2. Learning about smart contracts
3. aOi provides context: "These tools enable transparent research funding"
4. Click → "See Scientific Context"
5. Opens → tyt.foundation/knowledge
6. Understands real-world impact
```

#### Flow C: Adult Supporter → Participates

```
1. Reviews transparency on tyt.foundation
2. Sees impact reports and fund allocation
3. Decides to support
4. Click → "Support Research"
5. Redirects → takeyourtoken.app/fund
6. Uses Web3 tools to contribute
```

---

## aOi Character Specification

### Visual Identity (CANON - DO NOT CHANGE)

**Style**: `soft + tech + academic`

**Appearance**:
- Modern Japanese anime girl, age 16-18 (safe, non-sexualized)
- Big expressive eyes (kindness + awareness)
- Soft confident smile
- Minimalistic hoodie/light jacket (lavender, soft blue, white)
- Subtle tech details: small badge, bracelet, gentle interface glow
- Background: soft gradient or subtle medical/tech interface

**Character Evolution** (based on user level):

**Level 1 - Beginner** (10-14)
- Softer features, maximum empathy
- Minimal interface elements
- Tone: "I'm here, I'll explain"

**Level 2 - Explorer** (14-18)
- Sharper gaze, more confidence
- Simple schemas and hints appear
- Tone: "Let's figure this out together"

**Level 3 - Builder** (18-25)
- More mature proportions
- Structured background with diagrams
- Micro-holograms, charts
- Tone: "You're capable, I'll show the way"

**Level 4 - Guardian** (25+)
- Maximum composure
- Clean, institutional background
- System status indicators
- Tone: "I'm monitoring to keep things safe"

### Personality & Voice

**Tone**:
- Calm, confident, trustworthy
- NOT authoritarian
- NOT "all-knowing"
- Educational without being condescending

**Example Phrases**:
- "I can explain this in simpler terms."
- "This action has risks. Would you like an overview?"
- "You don't have access to this yet — here's how to unlock it."
- "That's a complex topic. Let me break it down step by step."

**What aOi Says**:
✅ "You don't need to be a doctor to help science."
✅ "These tools make research funding transparent."
✅ "Your progress is being recorded for your future."
✅ "Every action here supports real children and families."

**What aOi NEVER Says**:
❌ Any medical advice or diagnosis
❌ Investment recommendations
❌ Guaranteed returns or promises
❌ Personal opinions on treatments

---

## Security & Compliance Architecture

### Data Protection

**Medical Knowledge** (tyt.foundation):
- NO patient health information (PHI)
- Only curated, peer-reviewed research summaries
- Public educational content
- Ethics committee oversight

**User Data** (takeyourtoken.app):
- Guardian consent for users under 18
- NO financial actions in child accounts
- Age-appropriate content filtering
- RLS (Row Level Security) on all database tables

### Cross-Domain Security

**API Authentication**:
```typescript
// Foundation API calls include:
{
  origin: 'takeyourtoken.app',
  apiKey: env.FOUNDATION_API_KEY,
  sessionId: userSessionHash,
  timestamp: Date.now()
}
```

**CORS Configuration**:
```
Access-Control-Allow-Origin: https://takeyourtoken.app
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization, X-Client-Info
```

**Zero Trust Principles**:
- Every request authenticated
- Least privilege access
- Audit logging for all aOi actions
- Human-in-the-loop for sensitive operations

---

## aOi Multi-Agent Architecture

### Core Orchestrator (aOi Core)
**Role**: Routing, permissions, audit logging

**Functions**:
- Determines user type and permissions
- Routes to appropriate sub-agents
- Maintains conversation context
- Logs all actions to audit trail

### Knowledge & Science Layer (tyt.foundation)
**Agents**:
- Neuro-Oncology Knowledge Agent
- Research Update Agent
- Ethics & Compliance Agent

**Data Sources**:
- PubMed / NIH / WHO publications
- Curated peer-reviewed papers
- Clinical trial databases
- TYT Foundation research reports

**Output**:
- Simplified explanations
- Links to sources
- Difficulty levels (beginner → expert)
- NO medical advice or predictions

### Web3 & Infrastructure Layer (takeyourtoken.app)
**Agents**:
- Blockchain Education Agent
- Smart Contract Simulation Agent
- DAO Governance Agent
- Security & Audit Agent

**Functions**:
- Teach Web3 concepts
- Simulate contract interactions
- Explain risks and security
- Monitor blockchain transactions
- Audit system security

### Progress & Identity Layer (Cross-Domain)
**Functions**:
- Track learning progress
- Record achievements
- Manage age/role restrictions
- Verify guardian consent
- Issue proof-of-learning certificates

**Storage**:
- Off-chain: Progress details in database
- On-chain: Proof hashes only

---

## Implementation Roadmap

### Phase 1: Foundation (CURRENT)
✅ Header integration with aOi button
✅ Cross-domain navigation links
✅ Foundation API service structure
✅ Basic fallback mode
✅ Security audit responses
✅ Visual identity established

### Phase 2: Enhanced Integration (1-2 weeks)
- Deploy Foundation API on tyt.foundation
- Implement full AI backend (GPT-4/Claude)
- RAG system for medical knowledge
- Real-time connection status
- Context-aware responses
- Multi-language support

### Phase 3: Visual Assets (2-3 weeks)
- Generate aOi character images (4 levels)
- Animated avatar components
- Breathing/idle animations
- Emotion states (neutral, explaining, concerned, confident)
- Level transition animations

### Phase 4: Advanced Features (1-2 months)
- Voice interface
- Context preservation across domains
- Personalized learning paths
- Achievement NFTs (Soulbound)
- DAO governance integration
- Advanced security monitoring

---

## Key Integration Points Summary

### For Developers

**1. Environment Variables**:
```env
# Foundation API
VITE_FOUNDATION_API_URL=https://tyt.foundation/api
VITE_FOUNDATION_API_KEY=<secure-key>

# Domain Configuration
VITE_APP_DOMAIN=takeyourtoken.app
VITE_FOUNDATION_DOMAIN=tyt.foundation
```

**2. Import Structure**:
```typescript
// Cross-domain navigation
import { DOMAIN_CONFIG, buildCrossLink } from '@/config/navigation'

// Foundation API
import { foundationApi } from '@/services/foundationApi'

// aOi Component
import { AoiAssistant } from '@/components/AoiAssistant'
```

**3. Usage Pattern**:
```typescript
// Link to Foundation from App
<a href={DOMAIN_CONFIG.foundation.baseUrl + '/knowledge'}>
  Learn More on Foundation
</a>

// Ask aOi
const response = await foundationApi.askAoi({
  topic: userQuestion,
  userLevel: 'explorer',
  language: 'en',
  currentDomain: 'app'
})
```

---

## Monitoring & Analytics

### aOi Activity Metrics:
- Questions asked per domain
- Average response time
- Online vs fallback mode usage
- Most requested topics
- User satisfaction ratings

### Cross-Domain Flow:
- App → Foundation navigation events
- Foundation → App navigation events
- Time spent on each domain
- Conversion from visitor to student
- Student → supporter progression

### Security Metrics:
- Failed authentication attempts
- Suspicious activity flags
- API rate limiting triggers
- Guardian consent verifications

---

## Compliance & Legal

### COPPA (Children's Online Privacy Protection Act):
- Guardian consent required for users under 13
- NO data collection without consent
- Age-appropriate content filtering
- Parental access to child data

### GDPR (General Data Protection Regulation):
- Right to be forgotten
- Data portability
- Consent management
- Privacy by design

### Medical Disclaimers:
- aOi is NOT a medical professional
- NO diagnosis or treatment advice
- Information for educational purposes only
- Consult qualified medical professionals

### Financial Disclaimers:
- NO investment guarantees
- Risk disclosures required
- Educational content only
- NOT financial advice

---

## Support & Maintenance

### aOi Knowledge Updates:
- Monthly review of new research papers
- Quarterly knowledge base refresh
- Annual comprehensive audit
- Community feedback integration

### System Health Monitoring:
- 24/7 API availability monitoring
- Real-time error tracking (Sentry)
- Performance metrics (response times)
- Security incident detection

### User Support Escalation:
```
Level 1: aOi automated responses
Level 2: Knowledge base articles
Level 3: Community forums
Level 4: Human support team
Level 5: Medical/legal specialists (referrals only)
```

---

## Success Criteria

### Technical:
✅ 99.9% API uptime
✅ <500ms average response time
✅ <1% error rate
✅ Zero security incidents

### User Experience:
✅ Users understand connection between domains
✅ Seamless navigation between App and Foundation
✅ aOi provides helpful, accurate information
✅ Guardian consent process is clear

### Mission Impact:
✅ Students learn Web3 tools
✅ Students understand research context
✅ Increased Foundation support
✅ Transparent fund allocation visible
✅ Real research impact documented

---

## Conclusion

aOi is not just a feature — she is the **architectural connective tissue** of the entire TYT ecosystem, bridging:

- **Knowledge** (tyt.foundation) ↔ **Tools** (takeyourtoken.app)
- **Medical Context** ↔ **Web3 Infrastructure**
- **Students** ↔ **Supporters**
- **Learning** ↔ **Impact**

By maintaining strict separation of concerns while providing seamless integration, aOi enables the TYT vision:

**"Technology that enables medical breakthroughs, education that empowers participation, and transparency that builds trust."**

---

**aOi says**:
*"I'm here on both takeyourtoken.app and tyt.foundation. One AI, two homes, unified mission. Ask me anything about Web3 tools or brain tumor research — I'll guide you to the right place. 葵"*
