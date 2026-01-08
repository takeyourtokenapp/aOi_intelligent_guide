# Multilingual & Theme System Guide

## Overview

The TYT platform now supports:
- **3 languages**: English, Russian (Русский), Hebrew (עברית)
- **3 theme modes**: Light, Dark, Auto (time-based)
- **Persistent preferences**: Saved in localStorage
- **RTL support**: Automatic for Hebrew

---

## Language System

### Supported Languages

```typescript
'en' - English (default)
'ru' - Русский (Russian)
'he' - עברית (Hebrew)
```

### Auto-Detection

The system automatically detects browser language on first visit:
- Browser language `ru-*` → Russian
- Browser language `he-*` → Hebrew
- Otherwise → English

### RTL Support

Hebrew automatically enables RTL (right-to-left) layout:
```typescript
document.documentElement.setAttribute('dir', 'rtl');
```

### Usage in Components

```tsx
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
}
```

### Adding New Translations

Edit `/src/contexts/LanguageContext.tsx`:

```typescript
const translations: Record<Language, Record<string, string>> = {
  en: {
    'new.key': 'English text',
  },
  ru: {
    'new.key': 'Русский текст',
  },
  he: {
    'new.key': 'טקסט בעברית',
  },
};
```

---

## Theme System

### Theme Modes

```typescript
'light' - Light theme (white backgrounds)
'dark'  - Dark theme (dark backgrounds)
'auto'  - Automatic (based on time of day)
```

### Auto Theme Logic

When set to "Auto", theme changes based on time:
- **6:00 - 18:00** → Light theme
- **18:00 - 6:00** → Dark theme

Updates every minute automatically.

### Usage in Components

```tsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, effectiveTheme, setTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-900">
      <p>Current mode: {theme}</p>
      <p>Effective theme: {effectiveTheme}</p>
    </div>
  );
}
```

### Tailwind Dark Mode Classes

All Tailwind dark mode classes work automatically:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <p className="text-gray-600 dark:text-gray-400">Text</p>
  <button className="bg-blue-500 dark:bg-blue-700">Button</button>
</div>
```

---

## UI Components

### ThemeSwitcher

Located in: `/src/components/ThemeSwitcher.tsx`

Shows three buttons:
- Sun icon (Light)
- Moon icon (Dark)
- Clock icon (Auto)

### LanguageSwitcher

Located in: `/src/components/LanguageSwitcher.tsx`

Dropdown with flags:
- 🇬🇧 English
- 🇷🇺 Русский
- 🇮🇱 עברית

---

## Integration Points

### Navigation

Both switchers are integrated in the header:
- Desktop: Right side of navigation bar
- Mobile: Top of mobile menu

### Persistence

Settings are saved in localStorage:
```typescript
localStorage.getItem('tyt-theme')    // 'light' | 'dark' | 'auto'
localStorage.getItem('tyt-language') // 'en' | 'ru' | 'he'
```

### HTML Attributes

Theme and language are reflected in HTML:

```html
<!-- Theme -->
<html class="dark">...</html>

<!-- Language & Direction -->
<html lang="he" dir="rtl">...</html>
```

---

## Adding Support to New Components

### 1. Use Translation Hook

```tsx
import { useLanguage } from '../contexts/LanguageContext';

const { t } = useLanguage();
return <h1>{t('my.key')}</h1>;
```

### 2. Add Dark Mode Classes

```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-white">
    Content
  </p>
</div>
```

### 3. Consider RTL Layout

For elements that need RTL-aware positioning:

```tsx
<div className="flex gap-4 rtl:flex-row-reverse">
  <button>First</button>
  <button>Second</button>
</div>
```

---

## Translation Keys Structure

### Naming Convention

```
category.subcategory.item
```

### Current Categories

```
nav.*         - Navigation items
hero.*        - Hero section
footer.*      - Footer content
theme.*       - Theme switcher labels
lang.*        - Language names
stats.*       - Statistics labels
activity.*    - Activity feed
aoi.*         - aOi assistant
common.*      - Common UI elements
```

---

## Best Practices

### Language

1. Always use `t()` function for user-facing text
2. Keep keys descriptive: `hero.cta.learn` not `btn1`
3. Add all three languages when adding new keys
4. Test with all languages to ensure layout works
5. Consider text length differences (Russian is often longer)

### Theme

1. Always provide both light and dark variants
2. Test contrast ratios for accessibility
3. Use semantic color names in Tailwind config
4. Avoid hardcoded hex colors in components
5. Test "Auto" mode transitions

### RTL

1. Use logical properties: `ms-4` instead of `ml-4`
2. Test layout with Hebrew enabled
3. Icons that indicate direction should flip
4. Text alignment: use `text-start` not `text-left`

---

## Browser Support

- Modern browsers with localStorage
- CSS `prefers-color-scheme` (for system theme detection)
- Flex with `flex-row-reverse` (for RTL)
- All major browsers from 2020+

---

## Performance

- Translations: In-memory, no network requests
- Theme: localStorage only, no database calls
- Auto mode: Updates every 60 seconds (minimal overhead)
- RTL: CSS-only, no JavaScript layout calculations

---

## Future Enhancements

Potential additions:
- More languages (Spanish, French, German, Arabic)
- User profile integration (save to Supabase)
- System theme detection (`prefers-color-scheme`)
- High contrast mode for accessibility
- Font size preferences
- Compact/comfortable density modes

---

**Last Updated**: 2025-12-28
**Version**: 1.0.0
**Maintained By**: TYT Development Team
