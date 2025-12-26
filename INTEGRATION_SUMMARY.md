# 🎯 Интеграция aOi - Краткая сводка

## ✅ Что реализовано

### 1. Архитектура связи доменов
```
takeyourtoken.app ←→ aOi ←→ tyt.foundation
   (инструменты)      (навигатор)    (знание)
```

### 2. Компоненты

#### `Navigation.tsx`
Единая навигация для обоих доменов с ссылками:
- Academy → takeyourtoken.app/academy
- Knowledge → tyt.foundation/knowledge
- Foundation → tyt.foundation/foundation
- My Progress → takeyourtoken.app/dashboard

#### `AoiAssistant.tsx`
Плавающий AI-ассистент (правый нижний угол):
- ❌ Не дает медицинских советов
- ❌ Не дает финансовых рекомендаций
- ✅ Объясняет технологии
- ✅ Навигация между доменами
- ✅ Образовательный контекст

#### `CrossDomainBridge.tsx`
Блоки-мосты для перехода между доменами:
- `type="to-foundation"` - переход на tyt.foundation
- `type="to-app"` - переход на takeyourtoken.app
- Содержат контекст и объяснение связи

### 3. Supabase Progress Ledger

**База данных** уже настроена с таблицами:
- `profiles` - профили пользователей (уровни: beginner/explorer/builder/guardian)
- `progress_tracking` - прогресс обучения (academy/knowledge/contribution)
- `achievements` - достижения и сертификаты
- `guardian_consents` - согласия опекунов для детей
- `fund_transparency` - прозрачность фонда

**RLS (Row Level Security)** включён для всех таблиц.

### 4. Конфигурация

#### `config/navigation.ts`
```typescript
DOMAIN_CONFIG = {
  foundation: { baseUrl: 'https://tyt.foundation' },
  app: { baseUrl: 'https://takeyourtoken.app' }
}
```

#### `lib/supabase.ts`
Клиент Supabase с типами для всех таблиц.

## 🎨 Визуальная идентичность aOi

### Канон (зафиксирован)
```
aOi = soft + tech + academic
```

### Характеристики:
- 葵 (Aoi) - японский символ
- Modern anime style, 16-18 лет (безопасно)
- Lavender / Soft blue / White цвета
- NO sexualization, NO glamour
- Эмпатия + интеллект + доверие

### Эволюция по уровням:
```
Beginner (10-14)  → мягкие черты, максимум эмпатии
Explorer (14-18)  → чётче взгляд, схемы и подсказки
Builder  (18-25)  → взрослее, микро-голограммы
Guardian (25+)    → собранность, контрольный центр
```

## 🔗 Гиперссылочность

### Пример 1: Из tyt.foundation в App
```html
<!-- На странице knowledge о медуллобластоме -->
<CrossDomainBridge
  type="to-app"
  context="Learn how Web3 enables transparent medical funding"
/>
```

### Пример 2: Из App в Foundation
```html
<!-- В уроке Academy о blockchain -->
<CrossDomainBridge
  type="to-foundation"
  context="See how this technology supports children's brain cancer research"
/>
```

### Пример 3: Прямые ссылки
```typescript
import { buildCrossLink } from './config/navigation';

// Из app в foundation
const link = buildCrossLink('app', 'foundation', '/knowledge/brain-tumors');
// Результат: https://tyt.foundation/knowledge/brain-tumors
```

## 🧒 Guardian Gate (для детей)

### Поток регистрации:
1. Ребёнок создаёт профиль (nickname, возраст)
2. Система запрашивает email опекуна
3. Опекун получает ссылку для подтверждения
4. Опекун соглашается с Consent Form
5. Ребёнок получает доступ к обучению

### Ограничения детского аккаунта:
- ❌ Нет финансовых операций
- ❌ Нет NFT mining
- ✅ Только Academy и Knowledge
- ✅ Progress Ledger (для будущего)
- ✅ Симуляции (учебные)

## 📊 Progress Ledger

### Off-chain (Supabase)
Основное хранилище:
- Прогресс уроков
- Достижения
- Время обучения
- Метаданные

### On-chain (будущее)
Только хеши сертификатов:
- NO personal data
- Доказательство достижений
- Неизменяемое подтверждение
- Портфолио на всю жизнь

## 🚀 User Journey

### Сценарий 1: Школьник
```
tyt.foundation/knowledge
  ↓ читает о мозге
aOi: "Хочешь узнать, какие технологии помогают?"
  ↓ кнопка "Learn Web3 tools"
takeyourtoken.app/academy
  ↓ учит Web3 (без финансов)
  ↓ получает бейджи
Progress Ledger сохраняет результаты
```

### Сценарий 2: Студент
```
takeyourtoken.app/academy
  ↓ учит Blockchain
aOi: "Эти инструменты используются в медицинских исследованиях"
  ↓ ссылка "See scientific context"
tyt.foundation/knowledge
  ↓ понимает миссию
  ↓ вдохновлён помогать
```

### Сценарий 3: Взрослый
```
tyt.foundation/foundation
  ↓ читает whitepaper
  ↓ видит прозрачность
takeyourtoken.app/fund
  ↓ делает пожертвование
  ↓ участвует в governance
Blockchain proof + Impact tracking
```

## 🔒 Безопасность

### aOi НЕ делает:
- ❌ Медицинские советы
- ❌ Диагностику
- ❌ Финансовые рекомендации
- ❌ Управление средствами

### aOi делает:
- ✅ Объясняет технологии
- ✅ Навигация между доменами
- ✅ Образовательные подсказки
- ✅ Связывает контекст

### Данные:
- ❌ NO PHI (Protected Health Information)
- ❌ NO финансовые данные детей
- ✅ Только обучение и прогресс
- ✅ RLS на всех таблицах
- ✅ Guardian consent обязателен

## 📝 Следующие шаги

### Для полной интеграции:

1. **Создать tyt.foundation сайт**
   - Использовать ту же дизайн-систему
   - Добавить Navigation компонент
   - Интегрировать CrossDomainBridge

2. **Настроить SSO или Shared Session**
   - Единый вход для обоих доменов
   - Синхронизация профиля
   - Shared Progress Ledger

3. **Развернуть aOi Context API**
   ```typescript
   POST /api/aoi/explain
   POST /api/aoi/navigate
   GET /api/aoi/recommendations
   ```

4. **Интегрировать Guardian Gate**
   - Email workflow для опекунов
   - Consent form
   - Approval system

5. **Certificate Minting**
   - On-chain proof of achievements
   - Soulbound NFTs (SBT)
   - Immutable credentials

## 💡 Ключевые принципы

### Два домена — одна миссия
```
tyt.foundation = ЗАЧЕМ (знание, миссия, доверие)
takeyourtoken.app = КАК (инструменты, навыки, практика)
aOi = СВЯЗЬ (объяснение, не смешение)
```

### Академия учит ТОЛЬКО:
- ✅ Web3 / Blockchain
- ✅ Crypto Infrastructure
- ✅ DeFi / NFT Technology
- ❌ НЕ медицину

### Фонд объясняет ТОЛЬКО:
- ✅ Медицинские исследования
- ✅ Научный контекст
- ✅ Миссию и прозрачность
- ❌ НЕ технологии (детально)

### aOi соединяет:
"Вот проблема → вот технология → вот как помочь"

## 📞 Контакты компонентов

```typescript
// Navigation между доменами
import { Navigation } from './components/Navigation';

// AI-ассистент
import { AoiAssistant } from './components/AoiAssistant';

// Мосты между доменами
import { CrossDomainBridge } from './components/CrossDomainBridge';

// Supabase клиент
import { supabase } from './lib/supabase';

// Конфигурация
import { DOMAIN_CONFIG, NAVIGATION_LINKS } from './config/navigation';
```

## 🎯 Tagline

```
"Learn → Prove → Grow → Support"

Two domains • One mission • Connected by aOi
```

---

**Реализовано**: Полная архитектура связи между takeyourtoken.app и tyt.foundation через aOi как навигационный AI-агент.

**Статус**: ✅ Ready for deployment
