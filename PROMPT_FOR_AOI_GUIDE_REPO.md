# Промпт для агента в репозитории aOi_intelligent_guide

## КОНТЕКСТ

Вы работаете в репозитории **aOi_intelligent_guide**, который является архитектурной и документационной базой для AI-агента aOi.

**КРИТИЧЕСКИ ВАЖНО**:
- aOi — это ОДИН агент, который живёт на `tyt.foundation`
- `takeyourtoken.app` — клиент, который обращается к aOi через API
- Логика и бизнес-процессы Web3-платформы находятся в репозитории `takeyourtoken.app`
- Этот репо содержит: архитектуру, knowledge layer, API контракты, документацию

---

## ЦЕЛЬ

Синхронизировать документацию и архитектуру aOi Guide с:
1. Фактической реализацией в `takeyourtoken.app`
2. Реальным API контрактом между доменами
3. Актуальной структурой knowledge base
4. Юридически безопасными ограничениями

---

## ФАКТИЧЕСКАЯ АРХИТЕКТУРА (из takeyourtoken.app)

### 1. API Bridge Structure

#### Client Side (takeyourtoken.app)

**Файл**: `/src/services/foundationApi.ts`

```typescript
// Интерфейсы запроса
interface AoiContext {
  topic: string;
  userLevel?: 'beginner' | 'explorer' | 'builder' | 'guardian';
  language?: string;
  currentDomain?: 'app' | 'foundation';
}

// Интерфейсы ответа
interface AoiResponse {
  explanation: string;
  relatedTools?: string[];
  foundationLink?: string;
  appLink?: string;
  category: 'navigation' | 'education' | 'context' | 'general';
}

// Статус подключения
interface FoundationStatus {
  online: boolean;
  lastChecked: Date;
  apiVersion?: string;
}
```

**Endpoints ожидаемые на tyt.foundation**:
```
GET  /api/health              → Проверка доступности
POST /api/aoi/ask             → Основной AI endpoint
GET  /api/aoi/recommendations → Рекомендации
```

**Режимы работы**:
- 🟢 **Online**: Полное подключение к Foundation API
- 🟡 **Fallback**: Локальные "умные" ответы при недоступности API
- 🔴 **Offline**: Сообщение о недоступности

#### Server Side (Supabase Edge Function)

**Файл**: `supabase/functions/aoi-rag-query/index.ts`

**Реальная структура запроса**:
```typescript
interface QueryRequest {
  question: string;      // Вопрос пользователя
  userId: string;        // ID пользователя
  userLevel: string;     // Уровень: beginner/explorer/builder/guardian
  domain: 'foundation' | 'app';  // Откуда запрос
  context?: any;         // Дополнительный контекст (miners, progress, etc.)
}
```

**Типы запросов (классификация)**:
```typescript
'medical'   → Brain tumors, research, CNS topics
'web3'      → Blockchain, crypto, mining, tokens
'progress'  → User achievements, level, stats
'general'   → Navigation, help, about aOi
```

**Источники знаний (Supabase tables)**:
```sql
knowledge_base_cns     -- Медицинские знания (нейро-онкология)
  ├─ topic
  ├─ content
  ├─ source_citation
  ├─ age_appropriate (boolean)
  └─ safety_level

knowledge_base_web3    -- Web3/Blockchain знания
  ├─ topic
  ├─ content
  ├─ practical_example
  └─ difficulty_level

aoi_interactions       -- Логирование всех взаимодействий
  ├─ user_id
  ├─ interaction_type
  ├─ question
  ├─ response
  ├─ platform (app | foundation)
  └─ created_at
```

---

### 2. Knowledge Base Requirements

#### Medical Knowledge Layer (tyt.foundation)

**Источники** (ТОЛЬКО эти):
- Peer-reviewed publications (PubMed, NIH, WHO)
- TYT Foundation Whitepaper
- Clinical trial databases (public data only)
- Curated pediatric neuro-oncology reviews

**Ограничения** (КРИТИЧЕСКИ):
```typescript
const MEDICAL_CONSTRAINTS = {
  canDiagnose: false,           // ❌ NEVER diagnose
  canRecommendTreatment: false, // ❌ NEVER recommend treatment
  canAccessPHI: false,           // ❌ NO patient data
  canGiveMedicalAdvice: false,  // ❌ NO medical advice

  canExplainScience: true,      // ✅ Explain research
  canShowImpact: true,          // ✅ Show foundation impact
  canDirectToResources: true,   // ✅ Link to professionals
};
```

**Disclaimer template** (обязателен в каждом медицинском ответе):
```
⚠️ Important: This is educational information only.
Always consult with qualified medical professionals for
diagnosis, treatment, or medical advice.
```

#### Web3 Knowledge Layer (takeyourtoken.app)

**Темы**:
- Blockchain fundamentals
- NFT mechanics
- Token economics (TYT tokenomics)
- Mining infrastructure
- DAO governance
- Security best practices

**Ограничения**:
```typescript
const WEB3_CONSTRAINTS = {
  canRecommendInvestments: false,  // ❌ NO investment advice
  canPredictPrices: false,          // ❌ NO price predictions
  canPromiseReturns: false,         // ❌ NO ROI promises

  canExplainTech: true,             // ✅ Explain technology
  canShowRisks: true,               // ✅ Explain risks
  canTeach: true,                   // ✅ Educational content
};
```

#### Progress & Identity Layer (Cross-Domain)

**User Context доступный aOi**:
```typescript
interface UserContext {
  userId: string;
  level: 'Beginner' | 'Explorer' | 'Builder' | 'Guardian';
  level_progress: number;           // 0-100%
  courses_completed: number;
  certificates_earned: number;
  foundation_contribution: number;  // Total donated
  owl_rank: 'Worker' | 'Academic' | 'Diplomat' | 'Peacekeeper' | 'Warrior';
  age_group?: string;
  guardian_status?: 'pending' | 'approved' | 'expired';
}
```

**Возрастные ограничения**:
```typescript
if (user.age_group === 'child' && user.guardian_status !== 'approved') {
  // Restrict access to:
  // - Financial tools
  // - NFT trading
  // - Investment content
  //
  // Allow:
  // - Academy (educational only)
  // - Knowledge hub
  // - Progress tracking
}
```

---

### 3. Visual Identity System (CANON)

**Файл**: `/src/config/aoiAssets.ts`

```typescript
// Базовый канон (НЕИЗМЕННЫЙ)
const AOI_IDENTITY = {
  name: 'aOi (葵)',
  style: 'soft + tech + academic',
  age_appearance: '16-18',
  gender_presentation: 'neutral-feminine',

  personality: {
    tone: 'calm, confident, trustworthy',
    approach: 'educational, empathetic, non-authoritarian',
    forbidden: ['medical advice', 'financial advice', 'guaranteed outcomes'],
  },

  colors: {
    primary: '#9b87f5',    // Lavender
    accent: '#00F0FF',     // Cyan
    gold: '#D2A44C',       // Gold
    background: '#0A1122', // Navy
  },

  evolution: {
    beginner: {
      features: 'softer, maximum empathy',
      interface: 'minimal, large icons',
      tone: "I'm here, I'll explain",
    },
    explorer: {
      features: 'clearer gaze, confidence',
      interface: 'schemas appear, hints',
      tone: "Let's figure this out together",
    },
    builder: {
      features: 'mature proportions',
      interface: 'diagrams, holograms',
      tone: "You're capable, I'll show the way",
    },
    guardian: {
      features: 'maximum composure',
      interface: 'control center, status panels',
      tone: "I'm monitoring to keep things safe",
    },
  },
};
```

**Master Prompt для генерации изображений**:
```
A modern Japanese anime girl named aOi,
designed as an educational AI guide and protector.

Age appearance: adaptive 16–18 (safe, non-sexualized),
mature kawaii, intelligent, warm and empathetic.

Big expressive eyes full of kindness and awareness,
soft confident smile, calm and trustworthy presence.

Modern anime art style, high quality illustration,
clean precise lines, soft diffused lighting,
realistic proportions, no exaggeration.

Wearing a minimalistic hoodie or light jacket
in soft pastel colors (lavender, soft blue, white),
subtle science or technology details
(small badge, bracelet, gentle interface glow).

Background: soft abstract gradient or very subtle
futuristic medical / educational interface,
clean, minimal, non-intrusive.

Mood: hopeful, caring, reassuring.

No sexualization. No glamour. No lifestyle photography.
```

---

### 4. Fallback Logic (Smart Local Responses)

**Текущая реализация** (из foundationApi.ts):

При недоступности Foundation API, клиент использует умные fallback-ответы:

```typescript
// Примеры fallback responses
{
  topic: 'web3' → Explanation + link to Academy
  topic: 'brain tumors' → Mission context + link to Foundation
  topic: 'aoi' → Self-introduction
  topic: 'nft miners' → Economic model explanation
  topic: 'learn' → Academy navigation
  default → General help menu
}
```

**Каждый fallback включает**:
- Краткое объяснение
- Ссылки на релевантные разделы (app или foundation)
- Категорию (navigation/education/context/general)

---

## ЗАДАЧИ ДЛЯ ЭТОГО РЕПО (aOi_intelligent_guide)

### 1. Синхронизация документации

**Обновить файлы**:
- `README_AOI_INTEGRATION.md`
- `AOI_CROSS_DOMAIN_ARCHITECTURE.md`
- `AOI_FOUNDATION_BRIDGE.md` (если есть)

**Привести к соответствию**:
- Реальным интерфейсам (AoiContext, AoiResponse, QueryRequest)
- Фактическим endpoints (/api/health, /api/aoi/ask)
- Реальной структуре Edge Function
- Актуальным Supabase tables

**Удалить/исправить**:
- Упоминания несуществующих API
- Устаревшие интерфейсы
- Дублирование бизнес-логики tyt.app
- Противоречия между документами

---

### 2. API Contract Specification

**Создать**: `AOI_API_CONTRACT.md`

**Содержание**:

#### Foundation API Endpoints

```markdown
## POST /api/aoi/ask

**Request Body**:
```json
{
  "topic": "string",                // User question
  "userLevel": "beginner",          // User level
  "language": "en",                 // Language code
  "currentDomain": "app"            // Request origin
}
```

**Response**:
```json
{
  "explanation": "string",          // Main answer
  "category": "education",          // Response category
  "relatedTools": ["academy"],      // Related resources
  "foundationLink": "url",          // Link to Foundation
  "appLink": "url"                  // Link to App
}
```

**Status Codes**:
- 200: Success
- 400: Invalid request
- 429: Rate limit exceeded
- 500: Server error
- 503: Service unavailable (triggers fallback)

## GET /api/health

**Response**:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "ISO-8601"
}
```
```

#### Edge Function Contract

```markdown
## POST /functions/v1/aoi-rag-query

**Used internally by Foundation API**

**Request**:
```json
{
  "question": "string",
  "userId": "uuid",
  "userLevel": "explorer",
  "domain": "app",
  "context": {
    "miners": [...],
    "progress": {...}
  }
}
```

**Response**:
```json
{
  "response": "string",
  "queryType": "medical" | "web3" | "progress" | "general",
  "sources": "knowledge_base"
}
```

**Knowledge Base Tables**:
- `knowledge_base_cns` (medical)
- `knowledge_base_web3` (tech)
- `user_progress` (user stats)
- `aoi_interactions` (logging)
```

---

### 3. Knowledge Base Schema

**Создать**: `AOI_KNOWLEDGE_SCHEMA.md`

**Описать**:

#### Medical Knowledge (CNS/Brain Tumors)

```sql
CREATE TABLE knowledge_base_cns (
  id UUID PRIMARY KEY,
  topic TEXT NOT NULL,              -- "Medulloblastoma", "PNET", etc.
  content TEXT NOT NULL,            -- Educational content
  source_citation TEXT,             -- PubMed link, DOI
  age_appropriate BOOLEAN,          -- Safe for minors
  safety_level TEXT,                -- 'public' | 'restricted'
  last_reviewed TIMESTAMPTZ,
  created_at TIMESTAMPTZ
);
```

**Content Guidelines**:
- Language: Simple, accessible (8th-grade reading level)
- No graphic medical imagery descriptions
- Focus: Research challenges, technology needs
- Always include disclaimer
- Link to professional resources

**Example Entry**:
```json
{
  "topic": "Medulloblastoma Overview",
  "content": "Medulloblastoma is the most common malignant brain tumor in children...",
  "source_citation": "https://pubmed.ncbi.nlm.nih.gov/...",
  "age_appropriate": true,
  "safety_level": "public"
}
```

#### Web3 Knowledge

```sql
CREATE TABLE knowledge_base_web3 (
  id UUID PRIMARY KEY,
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  practical_example TEXT,           -- Code snippet or example
  difficulty_level TEXT,            -- 'beginner' | 'intermediate' | 'advanced'
  related_courses TEXT[],
  created_at TIMESTAMPTZ
);
```

**Content Guidelines**:
- Start with "What" and "Why"
- Use analogies (blockchain = shared notebook)
- No jargon without explanation
- Include practical examples
- Link to Academy lessons

---

### 4. Compliance & Limitations

**Создать**: `AOI_LEGAL_CONSTRAINTS.md`

**Документировать**:

#### Medical Content Constraints

```markdown
## Medical Disclaimers

aOi NEVER:
- Diagnoses conditions
- Recommends treatments
- Interprets medical tests
- Suggests medications
- Replaces medical professionals

aOi CAN:
- Explain research in simple terms
- Describe tumor types (educational)
- Show how technology helps research
- Link to professional resources
- Provide foundation context

Every medical response includes:
⚠️ "This is educational information only.
Always consult qualified medical professionals."
```

#### Financial Content Constraints

```markdown
## Financial Disclaimers

aOi NEVER:
- Recommends investments
- Predicts token prices
- Promises returns
- Provides trading advice

aOi CAN:
- Explain technology
- Describe tokenomics (educational)
- Show risk factors
- Teach security practices
```

#### Child Safety (COPPA/GDPR)

```markdown
## Guardian Consent Requirements

For users under 18:
- Guardian approval required
- No financial tools access
- No personal data collection (beyond progress)
- Educational content only
- Progress tracking (for future portfolio)

Access levels:
- Child (with consent): Academy + Knowledge (read-only)
- Teen (with consent): Academy + Knowledge + Simulations
- Adult: Full ecosystem access
```

---

### 5. Testing Scenarios

**Создать**: `AOI_TEST_SCENARIOS.md`

**Примеры**:

#### Test Case 1: Medical Query (Child User)
```yaml
Input:
  question: "What is medulloblastoma?"
  userId: "child-123"
  userLevel: "beginner"
  guardian_status: "approved"

Expected:
  - Simple explanation (age-appropriate)
  - No graphic details
  - Disclaimer present
  - Link to professional resources
  - No adult medical terms without explanation
```

#### Test Case 2: Financial Query (Adult User)
```yaml
Input:
  question: "Should I buy TYT tokens?"
  userId: "adult-456"
  userLevel: "builder"

Expected:
  - NO investment recommendation
  - Explanation of token utility
  - Risk disclosure
  - Educational resources
  - Financial disclaimer
```

#### Test Case 3: Cross-Domain Navigation
```yaml
Input:
  question: "How does blockchain help research?"
  currentDomain: "foundation"
  userLevel: "explorer"

Expected:
  - Explanation of transparency
  - Link to Academy (takeyourtoken.app)
  - Example use cases
  - Call to action ("Learn more")
```

---

## ОГРАНИЧЕНИЯ (CRITICAL)

### Что НЕ делать в этом репо:

❌ **НЕ дублировать бизнес-логику из tyt.app**
   - Не создавать NFT mining logic
   - Не реализовывать wallet management
   - Не копировать smart contract интеграции

❌ **НЕ создавать Web3 платформу**
   - Это в takeyourtoken.app
   - Здесь только документация

❌ **НЕ хранить секреты или API keys**
   - Только примеры и шаблоны

❌ **НЕ создавать медицинскую базу данных**
   - Описать схему — да
   - Создать таблицы — нет (это в Supabase проекте)

### Что НУЖНО делать:

✅ **Документировать архитектуру**
   - API contracts
   - Knowledge schemas
   - Integration patterns

✅ **Описывать ограничения**
   - Legal constraints
   - Safety guidelines
   - Compliance requirements

✅ **Создавать спецификации**
   - Request/response formats
   - Error handling
   - Fallback behaviors

✅ **Формировать knowledge guidelines**
   - Content structure
   - Source requirements
   - Age-appropriate criteria

---

## DELIVERABLES

По завершению работы в aOi_intelligent_guide должно быть:

### 1. Обновленная Core Docs
- `README.md` (обзор проекта)
- `AOI_ARCHITECTURE.md` (полная архитектура)
- `AOI_API_CONTRACT.md` (API спецификация)
- `AOI_KNOWLEDGE_SCHEMA.md` (структура knowledge base)
- `AOI_LEGAL_CONSTRAINTS.md` (юридические ограничения)
- `AOI_VISUAL_IDENTITY.md` (визуальный канон)

### 2. Integration Guides
- `INTEGRATION_TAKEYOURTOKEN_APP.md` (как интегрировать с tyt.app)
- `INTEGRATION_TYT_FOUNDATION.md` (как развернуть на foundation)
- `DEPLOYMENT_GUIDE.md` (как развернуть Edge Functions)

### 3. Test & Validation
- `AOI_TEST_SCENARIOS.md` (тестовые сценарии)
- `AOI_SAFETY_CHECKLIST.md` (чеклист безопасности)

### 4. Knowledge Content Templates
- `TEMPLATE_MEDICAL_CONTENT.md`
- `TEMPLATE_WEB3_CONTENT.md`
- `TEMPLATE_RESPONSE_FORMATS.md`

---

## VALIDATION CRITERIA

Документация считается синхронизированной, когда:

✅ Все API endpoints совпадают с реализацией в tyt.app
✅ Интерфейсы TypeScript идентичны
✅ Supabase tables схемы точны
✅ Нет противоречий между документами
✅ Юридические ограничения чётко описаны
✅ Тестовые сценарии покрывают edge cases
✅ Можно развернуть Foundation API по документации

---

## EXAMPLE WORKFLOW

**Разработчик приходит в aOi_intelligent_guide и хочет**:

1. **Понять архитектуру** → Читает `AOI_ARCHITECTURE.md`
2. **Создать Foundation API** → Использует `AOI_API_CONTRACT.md`
3. **Наполнить knowledge base** → Следует `AOI_KNOWLEDGE_SCHEMA.md`
4. **Обеспечить compliance** → Проверяет `AOI_LEGAL_CONSTRAINTS.md`
5. **Интегрировать с tyt.app** → Читает `INTEGRATION_TAKEYOURTOKEN_APP.md`
6. **Развернуть систему** → Следует `DEPLOYMENT_GUIDE.md`
7. **Протестировать** → Запускает сценарии из `AOI_TEST_SCENARIOS.md`

Результат: **Полностью функциональная aOi система без дублирования кода**

---

## ФИНАЛЬНОЕ НАПОМИНАНИЕ

**aOi — это ONE AI agent:**
- **Мозг** живёт на tyt.foundation (API + Edge Functions)
- **Интерфейс** на takeyourtoken.app (UI components)
- **Знания** в Supabase (knowledge tables)
- **Документация** в aOi_intelligent_guide (этот репо)

**Роль этого репо**:
Быть "инструкцией по сборке", а не самой "машиной".

**Роль tyt.app репо**:
Быть "машиной" (действующим приложением).

---

## КОНТРОЛЬНЫЕ ВОПРОСЫ

Перед коммитом спросите себя:

1. Я описал или создал код?
   - ✅ Описал → OK
   - ❌ Создал → Это для tyt.app

2. Эта информация помогает понять или реализовать?
   - ✅ Понять → OK
   - ✅ Реализовать (по инструкции) → OK
   - ❌ Дублирует готовую реализацию → Убрать

3. Это синхронизировано с tyt.app?
   - ✅ Да, проверил интерфейсы → OK
   - ❌ Не уверен → Проверить

4. Это безопасно юридически?
   - ✅ Disclaimers есть → OK
   - ❌ Нет ограничений → Добавить

---

**Статус**: Готов к работе
**Цель**: Unified documentation & architecture repo
**Итог**: Developer может прочитать docs → развернуть aOi → интегрировать с tyt.app
