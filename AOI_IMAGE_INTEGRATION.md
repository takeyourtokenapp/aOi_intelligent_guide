# aOi Image Integration — Technical Summary

## Статус

Компонент `AoiAvatar` полностью готов к использованию изображений aOi.

### Текущее состояние
- Приложение работает с красивым fallback (каджи 葵 на градиентном фоне)
- Поддержка изображений реализована и протестирована
- Автоматическое переключение между изображением и fallback

## Что было реализовано

### 1. Обновлён компонент `AoiAvatar`

**Местоположение**: `/src/components/AoiAvatar.tsx`

**Возможности**:
- Загружает изображения из `/public/aoi/`
- Автоматический fallback при отсутствии изображения
- Уникальные градиенты для каждого уровня:
  - 🌱 Beginner: лавандовый → розовый
  - 🔍 Explorer: циан → голубой
  - 🔨 Builder: золотой → жёлтый
  - 🛡️ Guardian: маджента → розовый
- Плавные переходы при загрузке
- Индикатор онлайн-статуса (пульсирующий)
- Поддержка hover с описанием

### 2. Система ассетов

**Местоположение**: `/src/config/aoiAssets.ts`

**Структура**:
```typescript
export const AOI_ASSETS: AoiAsset[] = [
  {
    id: 'aoi-beginner-neutral',
    path: '/aoi/beginner-neutral.png',
    level: 'beginner',
    emotion: 'neutral',
    description: 'Beginner level - soft features, maximum empathy',
  },
  // ... и так далее
];
```

### 3. Документация

**Создано**:
- `/public/aoi/README.md` — описание структуры и требований
- `/public/aoi/HOW_TO_ADD_IMAGES.md` — пошаговая инструкция
- `/public/aoi/check-images.sh` — скрипт проверки статуса
- `/public/aoi/example-placeholder.svg` — пример SVG-плейсхолдера

## Как добавить изображения

### Быстрый способ

1. Поместите PNG-файлы в `/public/aoi/`:
   ```
   beginner-neutral.png
   explorer-thinking.png
   builder-excited.png
   guardian-neutral.png
   ```

2. Перезагрузите приложение — изображения появятся автоматически

### Требования к файлам

- **Формат**: PNG с прозрачностью (или без)
- **Размер**: минимум 512×512px, рекомендуется 1024×1024px
- **Оптимизация**: для web
- **Именование**: строго как указано выше

### Генерация с помощью AI

Промпты для генерации находятся в `/src/config/aoiAssets.ts`:

```typescript
// Базовый промпт
AOI_PROMPTS.master

// Уровни
AOI_PROMPTS.beginner
AOI_PROMPTS.explorer
AOI_PROMPTS.builder
AOI_PROMPTS.guardian
```

**Рекомендуемые генераторы**:
- Midjourney (лучшее аниме)
- DALL-E 3
- Stable Diffusion (с anime models)

## Проверка статуса

### Через скрипт
```bash
cd public/aoi
./check-images.sh
```

### Визуально
Откройте приложение и проверьте:
- Главная страница (hero section с aOi)
- Foundation страница (аватар в заголовке)
- Academy страница (аватар в заголовке)
- Чат с aOi

## Технические детали

### Как работает fallback

```typescript
// 1. Компонент пытается загрузить изображение
<img src={asset.path} onError={() => setImageError(true)} />

// 2. Если ошибка — показывает каджи
{(!imageLoaded || imageError) && (
  <span>{AOI_CHARACTER.kanji}</span>
)}
```

### Градиенты по уровням

```typescript
const levelColors = {
  beginner: 'from-[#9b87f5] via-[#e0b4ff] to-[#c4b5fd]',
  explorer: 'from-[#00F0FF] via-[#7dd3fc] to-[#38bdf8]',
  builder: 'from-[#D2A44C] via-[#fbbf24] to-[#f59e0b]',
  guardian: 'from-[#FF00FF] via-[#e879f9] to-[#d946ef]',
};
```

## Дизайн-гайдлайны

### ✅ Обязательно
- Современный аниме стиль
- Возраст 16-18 (образовательный персонаж)
- Выразительные глаза, мягкая улыбка
- Пастельные цвета
- Tech-детали (бейдж, браслет, glow)
- Эмпатия + интеллект + доверие

### ❌ Запрещено
- Сексуализация
- Гламур / лайфстайл
- Слишком детский вид
- Агрессивная эстетика

## Интеграция в коде

### Использование компонента

```tsx
import { AoiAvatar } from '@/components/AoiAvatar';

// Базовое использование
<AoiAvatar level="explorer" emotion="thinking" />

// С именем и кастомным размером
<AoiAvatar
  level="guardian"
  size="xl"
  showName={true}
  showKanji={true}
/>
```

### Доступные пропсы

```typescript
interface AoiAvatarProps {
  level?: 'beginner' | 'explorer' | 'builder' | 'guardian';
  emotion?: 'neutral' | 'happy' | 'thinking' | 'concerned' | 'excited';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showKanji?: boolean;
  className?: string;
}
```

## Расширение системы

### Добавление новых эмоций

1. Добавьте изображение в `/public/aoi/`:
   ```
   explorer-happy.png
   ```

2. Добавьте запись в `AOI_ASSETS`:
   ```typescript
   {
     id: 'aoi-explorer-happy',
     path: '/aoi/explorer-happy.png',
     level: 'explorer',
     emotion: 'happy',
     description: 'Explorer level - joyful expression',
   }
   ```

### Добавление промежуточных уровней

Система поддерживает любое количество уровней. Просто:
1. Создайте новый level-тип
2. Добавьте цветовую схему
3. Добавьте изображения

## Производительность

### Оптимизация изображений

Рекомендуется:
- Сжатие PNG (TinyPNG, ImageOptim)
- Размер файла < 200KB
- WebP как альтернатива (требует обновления кода)

### Ленивая загрузка

Компонент использует встроенную загрузку браузера:
```typescript
onLoad={() => setImageLoaded(true)}
```

## Цветовая палитра aOi

```css
/* Primary Colors */
--aoi-lavender: #9b87f5;
--aoi-cyan: #00F0FF;
--aoi-gold: #D2A44C;

/* Supporting Colors */
--aoi-soft-blue: #7dd3fc;
--aoi-white: #ffffff;
--aoi-magenta: #FF00FF;

/* Background */
--aoi-navy: #0A1122;
--aoi-dark-blue: #1a2744;
```

## Поддержка

### Если изображения не отображаются

1. Проверьте имена файлов (должны совпадать точно)
2. Проверьте расположение (`/public/aoi/`, не `/src/`)
3. Очистите кэш браузера
4. Проверьте консоль браузера на ошибки 404

### Если fallback не красивый

Fallback использует:
- Уникальные градиенты для каждого уровня
- Каджи 葵 в центре
- Кольцо белого цвета
- Пульсирующий индикатор онлайн

Если что-то не так — проверьте Tailwind CSS.

---

**Статус проекта**: Production-ready

Приложение работает с или без изображений. Добавление PNG-файлов улучшит визуальную идентичность aOi, но не является критичным для функциональности.
