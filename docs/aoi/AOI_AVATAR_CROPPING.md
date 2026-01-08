# aOi Avatar — Image Cropping Technique

**Status**: ✅ Implemented

Используем CSS для показа лица aOi в маленьких круглых аватарах.

---

## Problem

Полноразмерные изображения aOi (580x2774px, ratio 1:4.78) не работают в маленьких аватарах:
```
┌──────┐
│      │  ← голова теряется
│ тело │
│ ноги │
└──────┘
```

## Solution: CSS Object Positioning

```css
object-fit: cover         /* fill container */
object-position: top      /* align to top */
transform: scale(1.5)     /* zoom 1.5x */
```

**Result**: Показываем только верхнюю часть = лицо и плечи
```
┌────────┐
│ Глаза  │  ← perfect!
│ Улыбка │
└────────┘
```

---

## Implementation

### Navigation Header (32x32px)
```tsx
<div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#00F0FF] overflow-hidden">
  <img
    src="/aoi/explorer-thinking.png"
    className="w-full h-full object-cover object-top scale-150"
  />
</div>
```

### AoiAssistant Chat (48x48px)
```tsx
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#00F0FF] overflow-hidden">
  <img
    src="/aoi/explorer-thinking.png"
    className="w-full h-full object-cover object-top scale-150"
  />
</div>
```

### AoiAvatar Component (all sizes)
```tsx
<img
  src={asset.path}
  className="w-full h-full object-cover object-top scale-150"
/>
```

---

## Where Used

✅ **Navigation (Desktop)**: 32px header button
✅ **Navigation (Mobile)**: 40px menu button  
✅ **AoiAssistant**: 48px chat header
✅ **AoiAvatar**: 48-128px dynamic sizes

---

## Visual Comparison

**Before** (SVG placeholder):
```
┌──────┐
│  葵  │  kanji only
└──────┘
```

**After** (Real image cropped):
```
┌──────┐
│ 👧🏻  │  aOi's face
│      │  eyes visible
└──────┘
```

---

## Fallback System

**Level 1**: PNG image (cropped)
**Level 2**: Gradient background
**Level 3**: Kanji character 葵

```tsx
<div className="relative">
  <img src="/aoi/explorer-thinking.png" />
  <span className="absolute">葵</span>
</div>
```

---

**Result**: aOi's лицо видно во всех размерах аватара
