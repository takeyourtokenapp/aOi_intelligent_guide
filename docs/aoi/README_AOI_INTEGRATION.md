# aOi (葵) Integration Guide

**Version**: 1.0.0 | **Last Updated**: 2025-12-28 | **Status**: Production Ready

## Overview

This guide provides a comprehensive overview of aOi integration across the TYT ecosystem. For detailed specifications, see the linked documentation.

## 📚 Complete Documentation Suite

### Core Documentation
- **[AOI_API_CONTRACT.md](./AOI_API_CONTRACT.md)** - API specification between domains
- **[AOI_KNOWLEDGE_SCHEMA.md](./AOI_KNOWLEDGE_SCHEMA.md)** - Database schema and content structure
- **[AOI_LEGAL_CONSTRAINTS.md](./AOI_LEGAL_CONSTRAINTS.md)** - Legal, ethical, and safety constraints
- **[AOI_VISUAL_IDENTITY.md](./AOI_VISUAL_IDENTITY.md)** - Visual canon and brand guidelines

### Implementation Guides
- **[AOI_TEST_SCENARIOS.md](./AOI_TEST_SCENARIOS.md)** - Comprehensive test scenarios
- **[AOI_SAFETY_CHECKLIST.md](./AOI_SAFETY_CHECKLIST.md)** - Pre-deployment and ongoing safety checks

### Content Templates
- **[TEMPLATE_MEDICAL_CONTENT.md](./TEMPLATE_MEDICAL_CONTENT.md)** - Medical knowledge formatting
- **[TEMPLATE_WEB3_CONTENT.md](./TEMPLATE_WEB3_CONTENT.md)** - Web3 education formatting
- **[TEMPLATE_RESPONSE_FORMATS.md](./TEMPLATE_RESPONSE_FORMATS.md)** - Response templates

---

## Architecture Overview

### Two Domains — One Mission

```
┌─────────────────────────────────────────────────────────────┐
│                    aOi - AI Navigator                        │
│              (Lives on tyt.foundation)                       │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
         ┌────────▼─────────┐    ┌────────▼─────────┐
         │ tyt.foundation   │    │takeyourtoken.app │
         │                  │    │                  │
         │  KNOWLEDGE       │◄───►│  TOOLS           │
         │  • Neuro-onco    │    │  • Web3          │
         │  • Research      │    │  • Blockchain    │
         │  • Whitepaper    │    │  • Academy       │
         │  • Transparency  │    │  • NFT Mining    │
         └──────────────────┘    └──────────────────┘
```

**Critical**: aOi is ONE agent that lives on `tyt.foundation`. `takeyourtoken.app` is a client that calls aOi via API.

## Ключевые принципы

### 1. aOi — это НЕ:
- ❌ Чат-бот
- ❌ Маскот
- ❌ Медицинский советник
- ❌ Финансовый консультант

### 2. aOi — это:
- ✅ Навигационный AI-ассистент
- ✅ Проводник между знанием и инструментами
- ✅ Образовательный гид
- ✅ Связующее звено между доменами

## Роли доменов

### tyt.foundation (Место жительства aOi)
**Роль**: Знание, Миссия, Доверие

**Контент**:
- Педиатрическая нейроонкология (популярно)
- Whitepaper и исследования
- Партнерства (I-QCC и др.)
- Прозрачность фонда
- Истории и нарратив

**aOi здесь**:
- Объясняет сложную науку простыми словами
- Показывает "ЗАЧЕМ нужны технологии"
- Направляет на takeyourtoken.app для обучения

### takeyourtoken.app
**Роль**: Инструменты, Навыки, Практика

**Контент**:
- Crypto & Blockchain Academy
- Web3-инструменты
- NFT Mining Dashboard
- DAO Governance
- Progress Tracking

**aOi здесь**:
- Обучает Web3/Blockchain
- Показывает "КАК работают инструменты"
- Связывает технологии с миссией фонда
- Направляет на tyt.foundation для контекста

## Гиперссылочность

### Единая навигация
Оба сайта имеют идентичный header:
```
Academy | Knowledge | Foundation | Transparency | My Progress
```

### Cross-Domain Links

#### На tyt.foundation:
```html
<!-- В статье о медуллобластоме -->
<p>
  Такие исследования требуют мощных вычислений и прозрачного финансирования.
  <a href="https://takeyourtoken.app/academy/lesson/web3-for-science">
    Пройти урок: Web3 для науки →
  </a>
</p>
```

#### На takeyourtoken.app:
```html
<!-- В уроке про Web3 -->
<div class="context-box">
  <p>Эти инструменты применяются в реальных исследованиях</p>
  <a href="https://tyt.foundation/knowledge/brain-tumors">
    Узнать, как это помогает детям →
  </a>
</div>
```

## Supabase Integration

### Progress Ledger

**Off-chain (основное хранилище)**:
```typescript
// Supabase tables:
- profiles           // профили пользователей
- progress_tracking  // прогресс обучения
- achievements       // достижения
- guardian_consents  // согласия опекунов
- fund_transparency  // прозрачность фонда
```

**On-chain (якоря доверия)**:
```solidity
// Только хеши сертификатов
// NO personal data
mapping(address => bytes32[]) public certificateHashes;
```

### Пример использования

```typescript
import { supabase } from './lib/supabase';

// Обновить прогресс
await supabase
  .from('progress_tracking')
  .insert({
    profile_id: user.id,
    module_type: 'academy',
    module_id: 'web3-basics',
    progress_percent: 75,
  });

// Получить достижения
const { data: achievements } = await supabase
  .from('achievements')
  .select('*')
  .eq('profile_id', user.id);
```

## Guardian Gate (для детей)

### Поток:
1. Ребенок создает профиль (nickname, без email)
2. Система запрашивает подтверждение опекуна
3. Опекун получает ссылку/код
4. Опекун подтверждает Consent Form
5. Ребенок получает доступ к обучению

### Ограничения:
- ❌ Нет доступа к финансовым инструментам
- ❌ Нет NFT mining
- ✅ Только Academy и Knowledge
- ✅ Progress tracking "на будущее"

## User Journey

### Ребенок (10-14)
```
tyt.foundation/knowledge
  ↓ читает о мозге
  ↓ "почему это сложно?"
aOi: "Нужны технологии. Хочешь узнать?"
  ↓ кнопка
takeyourtoken.app/academy
  ↓ учит Web3 (без финансов)
  ↓ получает бейджи
Progress Ledger
```

### Студент (18+)
```
takeyourtoken.app/academy
  ↓ учит Blockchain
aOi: "Это используется в медицинских исследованиях"
  ↓ ссылка
tyt.foundation/knowledge
  ↓ понимает контекст
  ↓ вдохновлен
takeyourtoken.app/contribute
```

### Инвестор (25+)
```
tyt.foundation/foundation
  ↓ читает whitepaper
  ↓ видит прозрачность
takeyourtoken.app/fund
  ↓ делает donation
  ↓ получает proof on-chain
Progress Ledger + Blockchain
```

## Визуальная идентичность aOi

### Канон
```
aOi = soft + tech + academic
```

### Характеристики:
- Modern Japanese anime girl (16-18)
- Big expressive eyes (kindness + awareness)
- Soft confident smile
- Lavender / Soft blue / White hoodie
- Small tech badge
- Gentle interface glow
- NO sexualization
- NO glamour
- NO lifestyle photography

### Эволюция по уровням:
```
Beginner   → мягкие черты, максимум эмпатии
Explorer   → чётче взгляд, появляются схемы
Builder    → взрослее, микро-голограммы
Guardian   → максимум собранности, контрольный центр
```

## API Endpoints

### Foundation API (tyt.foundation)

```typescript
// Health check
GET /api/health

// Ask aOi
POST /api/aoi/ask
{
  "topic": "medulloblastoma",
  "userLevel": "beginner",
  "language": "en",
  "currentDomain": "app"
}

// Recommendations
GET /api/aoi/recommendations?userId={uuid}&level={string}
```

**Full API specification**: See [AOI_API_CONTRACT.md](./AOI_API_CONTRACT.md)

### Edge Function (Supabase)

```typescript
POST /functions/v1/aoi-rag-query
{
  "question": "What is blockchain?",
  "userId": "uuid",
  "userLevel": "explorer",
  "domain": "app",
  "context": {...}
}
```

**Implementation**: `/supabase/functions/aoi-rag-query/index.ts`

## Security & Compliance

### Данные
- ❌ NO медицинские данные
- ❌ NO финансовые данные детей
- ✅ Только обучение и прогресс
- ✅ Guardian consent обязателен
- ✅ RLS на всех таблицах

### aOi ограничения
```typescript
const AOI_RULES = {
  canGiveMedicalAdvice: false,
  canRecommendInvestments: false,
  canAccessPHI: false,
  canExplainTech: true,
  canLinkDomains: true,
  canTrackProgress: true,
};
```

## Deployment

### Frontend
```bash
# takeyourtoken.app
npm run build
# Deploy to Vercel/Netlify

# tyt.foundation
# Deploy to separate hosting
# Same design system, different content
```

### Database
```bash
# Supabase migrations already applied
# Tables: profiles, progress_tracking, achievements, etc.
```

## Tagline

```
"Learn → Prove → Grow → Support"
```

### Для родителей:
"Ваш ребёнок изучает науку безопасно. Прогресс фиксируется и может стать портфолио на будущее."

### Для студентов:
"Build a verifiable learning record. Join real research infrastructure."

## Implementation Status

### ✅ Completed
- [x] Client-side API service (`/src/services/foundationApi.ts`)
- [x] Edge Function (`/supabase/functions/aoi-rag-query/index.ts`)
- [x] Knowledge base schema (migration applied)
- [x] Visual identity system (`/src/config/aoiAssets.ts`)
- [x] Fallback mode (smart local responses)
- [x] Cross-domain navigation config
- [x] User progress tracking
- [x] Complete documentation suite

### 🚧 In Progress
- [ ] Deploy Foundation API on tyt.foundation
- [ ] Populate knowledge base (CNS + Web3 content)
- [ ] Implement Guardian consent flow
- [ ] Set up monitoring and analytics

### 📋 Roadmap
- [ ] Cross-domain SSO/authentication
- [ ] Certificate minting (on-chain proof)
- [ ] Multi-language support
- [ ] Voice interaction mode
- [ ] Mobile app integration

---

## Quick Start

### For Developers

1. **Read the architecture**: [AOI_API_CONTRACT.md](./AOI_API_CONTRACT.md)
2. **Review constraints**: [AOI_LEGAL_CONSTRAINTS.md](./AOI_LEGAL_CONSTRAINTS.md)
3. **Check schema**: [AOI_KNOWLEDGE_SCHEMA.md](./AOI_KNOWLEDGE_SCHEMA.md)
4. **Run tests**: [AOI_TEST_SCENARIOS.md](./AOI_TEST_SCENARIOS.md)
5. **Deploy safely**: [AOI_SAFETY_CHECKLIST.md](./AOI_SAFETY_CHECKLIST.md)

### For Content Creators

1. **Medical content**: Use [TEMPLATE_MEDICAL_CONTENT.md](./TEMPLATE_MEDICAL_CONTENT.md)
2. **Web3 content**: Use [TEMPLATE_WEB3_CONTENT.md](./TEMPLATE_WEB3_CONTENT.md)
3. **Responses**: Follow [TEMPLATE_RESPONSE_FORMATS.md](./TEMPLATE_RESPONSE_FORMATS.md)
4. **Review safety**: Check [AOI_LEGAL_CONSTRAINTS.md](./AOI_LEGAL_CONSTRAINTS.md)

### For Designers

1. **Visual canon**: [AOI_VISUAL_IDENTITY.md](./AOI_VISUAL_IDENTITY.md)
2. **Asset specs**: `/src/config/aoiAssets.ts`
3. **Color system**: Primary #9b87f5, Accent #00F0FF, Gold #D2A44C
4. **Master prompt**: See visual identity guide

---

## Key Contacts

- **Technical**: TYT Development Team
- **Medical Content**: Medical Advisory Board
- **Legal/Compliance**: TYT Legal Team
- **Design**: TYT Design Team

---

## License & Usage

All aOi documentation and specifications are proprietary to TYT Foundation.

**Remember**: aOi is not just a feature — she is the bridge between technology and humanity, between complexity and understanding, between Web3 and children's lives.
