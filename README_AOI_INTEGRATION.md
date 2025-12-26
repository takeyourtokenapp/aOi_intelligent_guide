# aOi (葵) Integration Guide

## Архитектура экосистемы TYT

### Два домена — одна миссия

```
┌─────────────────────────────────────────────────────────────┐
│                    aOi - AI Navigator                        │
│                  (Connecting Layer)                          │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
         ┌────────▼─────────┐    ┌────────▼─────────┐
         │ tyt.foundation   │    │takeyourtoken.app│
         │                  │    │                  │
         │  ЗНАНИЕ          │◄───►│  ИНСТРУМЕНТЫ    │
         │  • Нейроонко     │    │  • Web3         │
         │  • Наука         │    │  • Blockchain   │
         │  • Whitepaper    │    │  • Academy      │
         │  • Прозрачность  │    │  • NFT Mining   │
         └──────────────────┘    └──────────────────┘
```

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

## API Endpoints (будущее)

### aOi Context API
```typescript
POST /api/aoi/explain
{
  "topic": "medulloblastoma",
  "userLevel": "beginner",
  "language": "en"
}

Response:
{
  "explanation": "...",
  "relatedTools": ["web3-basics", "blockchain-intro"],
  "foundationLink": "https://tyt.foundation/knowledge/mb"
}
```

### Progress Sync API
```typescript
GET /api/progress/:userId
Response:
{
  "academy": { completed: 15, total: 50 },
  "knowledge": { read: 8, total: 20 },
  "achievements": [...],
  "nextRecommendation": "..."
}
```

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

## Следующие шаги

1. **Создать tyt.foundation сайт** с той же дизайн-системой
2. **Настроить cross-domain authentication** (SSO или shared session)
3. **Развернуть aOi Context API** для умных подсказок
4. **Интегрировать Guardian Gate** в регистрацию
5. **Создать Certificate Minting** для on-chain proof

## Контакты для интеграции

- takeyourtoken.app: Web3 tools & Academy
- tyt.foundation: Knowledge hub & Mission
- Supabase: Progress Ledger
- aOi: Navigation layer

---

**Помните**: aOi — это мост, а не стена. Она соединяет, а не разделяет.
